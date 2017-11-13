let mongoose = require('mongoose');

let IngredientSchema = new mongoose.Schema({
    name: String,
    amount: {type: Number, default: 0},
    unit: String
});

IngredientSchema.pre('remove', function(next) {
    this.model('Recipe').remove({ingredients: this_.id}, next);
})

mongoose.model('Ingredient', IngredientSchema);