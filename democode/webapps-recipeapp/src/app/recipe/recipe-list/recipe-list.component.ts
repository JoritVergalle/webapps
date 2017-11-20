import { RecipeDataService } from './../recipe-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  providers: [ RecipeDataService ]
})
export class RecipeListComponent implements OnInit {
  private _recipes: Recipe[];

    constructor(private _recipeDataService: RecipeDataService) {
    }

    ngOnInit() {
      this._recipeDataService.recipes.subscribe(items => this._recipes = items);
    }
    get recipes() {
      return this._recipes;
    }

  removeRecipe(recipe: Recipe) {
    this._recipeDataService.removeRecipe(recipe).subscribe(item =>
      this._recipes = this._recipes.filter(val => item.id !== val.id)
    );
  }
}
