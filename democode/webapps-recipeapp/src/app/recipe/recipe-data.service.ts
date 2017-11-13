import { AuthenticationService } from '../user/authentication.service';
import { Ingredient } from './ingredient/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class RecipeDataService {
  private _appUrl = 'http://localhost:4200/API/';
  private _recipes;

  constructor(private http: Http, private auth: AuthenticationService) {
  }

  get recipes(): Observable<Recipe[]> {
    return this.http.get(`${this._appUrl}/recipes`, { headers: new Headers({Authorization: `Bearer ${this.auth.token}`}) })
      .map(response => response.json().map(item => Recipe.fromJSON(item)));

  }

  getRecipe(id): Observable<Recipe> {
    return this.http.get(`${this._appUrl}/recipe/${id}`)
      .map(response => response.json()).map(item => Recipe.fromJSON(item));
  }

  addNewRecipe(rec): Observable<Recipe> {
    return this.http.post(`${this._appUrl}/recipes`, rec)
      .map(res => res.json()).map(item => Recipe.fromJSON(item));
  }

  addIngredientToRecipe(ing: Ingredient, rec: Recipe): Observable<Ingredient> {
    return this.http.post(`${this._appUrl}/recipe/${rec.id}/ingredients`, ing)
      .map(res => res.json()).map(item => Ingredient.fromJSON(item));
  }

  removeRecipe(rec) {
    return this.http.delete(`${this._appUrl}/recipe/${rec.id}`).map(res => res.json()).map(item => Recipe.fromJSON(item));
  }
}
