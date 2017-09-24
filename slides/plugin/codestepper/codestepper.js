var CodeStepper = window.CodeStepper || (function () {
    // if I'd ever feel the need, these could become options somehow
    const highlightFirstAppearanceInCodeBlocks = true;

    let currentIndex = -1;
    let maxIndex = -1;

    let showHide = new Map();
    let showFirstTime = new Map(); // subset of the above, only when a step is shown the first time it appears here
    let allShowHide = new Set();

    let highlight = {};
    let allHighlight = new Set();

    function toArray(o) {
        return Array.prototype.slice.call(o);
    }

    // will parse a string of the form "1,2,3-7,9-12,14"
    // and return [1,2,3,4,5,6,7,9,10,11,12,14] as an array of integers
    // (little error handling, make sure for 'a-b' that a<b etc.)
    function parseRange(range) {
        let result = [];
        range.split(',').forEach(el => {
            let dashRange = el.split('-');
            if (dashRange.length === 1) {
                result.push(parseInt(el));
            } else {
                let from = parseInt(dashRange[0]);
                let to = parseInt(dashRange[1]);
                if (to >= from) {
                    for (let i = from; i <= to; ++i) {
                        result.push(i);
                    }
                }
            }
        });
        return result;
    }

    function showHighlightCurrentIndex() {
        allShowHide.forEach(val => { 
            val.setAttribute('hidden', true);
            val.classList.remove('highlight-green');
        });
        if (showHide.get(currentIndex)) {
            showHide.get(currentIndex).forEach(val => val.removeAttribute('hidden'));
        }
        if (highlightFirstAppearanceInCodeBlocks && currentIndex != 1 && showFirstTime.get(currentIndex)) {
            showFirstTime.get(currentIndex).forEach(val => val.classList.add('highlight-green'));
        }
        allHighlight.forEach(val => val.classList.remove('highlight-red'))
        if (currentIndex in highlight) {
            highlight[currentIndex].forEach(val => val.classList.add('highlight-red'));
        }
    }

    function innerNavigateNext() {
        currentIndex++;
        if (currentIndex > maxIndex) {
            Reveal.configure({
                keyboard: {
                }
            });
            Reveal.navigateNext();
        } else {
            showHighlightCurrentIndex();
        }
    }

    function innerNavigatePrevious() {
        currentIndex--;
        if (currentIndex <= 0) {
            Reveal.configure({
                keyboard: {
                }
            });
            Reveal.navigatePrevious();
        } else {
            showHighlightCurrentIndex();
        }
    }

    Reveal.addEventListener('fragmentshown', function (event) {
        if (event.fragment.hasAttribute("code-step")) {
            currentIndex = 1;
            maxIndex = -1;
            showHide = new Map();
            allShowHide = new Set();
            highlight = {};
            allHighlight = new Set();
            // first adapt the 'samespot' childNodes, remove extra added newlines (it's inside a code block)
            // and add css to the inner span's
            toArray(event.fragment.getElementsByTagName('*')).forEach(el => {
                if (el.classList.contains('samespot')) {
                    for (let i = 0; i < el.childNodes.length;) {
                        if (el.childNodes[i].nodeType == 3) { // TEXT
                            // remove all the newlines that were used to add the different <span> childnodes
                            // in a readable manner (the <pre><code> preserves them, leading to superfluous whitespace)
                            el.removeChild(el.childNodes[i]);
                        } else {
                            if (el.childNodes[i].nodeName === "SPAN" || el.childNodes[i].nodeName === "P") {
                                el.childNodes[i].classList.add("samespot-content");
                            }
                            ++i;
                        }
                    }
                }
            });
            // loop again over the children (above loop changed the DOM), now simply remember all the 
            // show-steps, highlight-steps spans
            toArray(event.fragment.getElementsByTagName('*')).forEach(el => {
                if (el.hasAttribute('show-steps')) {
                    // el.classList.add('replace-content');
                    allShowHide.add(el);
                    let showRange = parseRange(el.getAttribute('show-steps'));
                    showRange.forEach(nr => {
                        showHide.set(nr, showHide.get(nr) || new Array());
                        showHide.get(nr).push(el);
                        maxIndex = nr > maxIndex ? nr : maxIndex;
                    });
                    if (highlightFirstAppearanceInCodeBlocks && showRange.length) {
                        // see if we're inside a code tag
                        let insideCodeTag = false;
                        let pnode = el.parentNode;
                        while (pnode && pnode.nodeName != "HTML") {
                            if (pnode.nodeName === "CODE") {
                                insideCodeTag = true;
                                break;
                            }
                            pnode = pnode.parentNode;
                        }
                        if (insideCodeTag) {
                            showFirstTime.set(showRange[0], showFirstTime.get(showRange[0]) || new Array());
                            showFirstTime.get(showRange[0]).push(el);
                        }
                    }
                }
                if (el.hasAttribute('highlight-steps')) {
                    allHighlight.add(el);
                    parseRange(el.getAttribute('highlight-steps')).forEach(nr => {
                        highlight[nr] = highlight[nr] || new Array();
                        highlight[nr].push(el);
                        maxIndex = nr > maxIndex ? nr : maxIndex;
                    });
                }

            });
            showHighlightCurrentIndex();
            // (ab)use the user defined keyboard shortcuts to 'swallow' ->, space etc.
            Reveal.configure({
                keyboard: {
                    34: innerNavigateNext,
                    78: innerNavigateNext,
                    39: innerNavigateNext,
                    76: innerNavigateNext,
                    80: innerNavigatePrevious,
                    33: innerNavigatePrevious,
                    72: innerNavigatePrevious,
                    37: innerNavigatePrevious,
                }
            });
        }
    })
})();