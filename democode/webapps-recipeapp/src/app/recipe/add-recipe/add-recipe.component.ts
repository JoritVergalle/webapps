import { Router } from '@angular/router';
import { RecipeDataService } from './../recipe-data.service';
import { Ingredient, UnitType } from './../ingredient/ingredient.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';


import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
  providers: [ RecipeDataService ]
})
export class AddRecipeComponent implements OnInit {
  @Output() public newRecipe = new EventEmitter<Recipe>();
  private recipe: FormGroup;
  public readonly unitTypes = ['', 'Liter', 'Gram', 'Tbsp'];

  constructor(private fb: FormBuilder, private _recipeDataService: RecipeDataService, private _router: Router) { }

  get ingredients(): FormArray {
    return <FormArray>this.recipe.get('ingredients');
  }

  ngOnInit() {
    this.recipe = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      ingredients: this.fb.array([ this.createIngredients() ])
    });

    this.ingredients.statusChanges.debounceTime(400).distinctUntilChanged().subscribe(data => {
      if (data === 'VALID') {
        this.ingredients.push(this.createIngredients());
      }
    });
  }

  createIngredients(): FormGroup {
    return this.fb.group({
      amount: [''],
      unit: [''],
      ingredientname: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    const recipe = new Recipe(this.recipe.value.name);
    for (const ing of this.recipe.value.ingredients) {
      if (ing.ingredientname.length > 2) {
        const ingredient = new Ingredient(ing.ingredientname, ing.amount, ing.unit );
        recipe.addIngredient(ingredient);
      }
    }
    this._recipeDataService.addNewRecipe(recipe).subscribe(item => {
      const ingr = recipe.ingredients.map(ing =>
        this._recipeDataService.addIngredientToRecipe(ing, item));

      Observable.forkJoin(...ingr).subscribe( (ingredients: Ingredient[]) => {
        for (const ing of ingredients) {
          item.addIngredient(ing);
        }
        // return this._recipes.push(item)
        // return item;
        this._router.navigate(['recipe-list']);
      }
      );
    });
    // this.newRecipe.emit(recipe);
  }

}
