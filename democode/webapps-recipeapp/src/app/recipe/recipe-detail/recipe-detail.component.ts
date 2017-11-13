import { RecipeDataService } from './../recipe-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  private _recipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeDataService: RecipeDataService) {
  }

  get recipe() {
    return this._recipe;
  }

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // this.recipeDataService.getRecipe(id).subscribe(item => this._recipe = item);

    this.route.data.subscribe(item => this._recipe = item['recipe']);
    // this.route.paramMap.subscribe(pa =>
    //   this.recipeDataService.getRecipe(pa.get('id')).subscribe(item => this._recipe = item)
    // );
  }
}
