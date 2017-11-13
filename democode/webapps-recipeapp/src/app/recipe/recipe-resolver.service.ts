import { RecipeDataService } from './recipe-data.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class RecipeResolver implements Resolve< Recipe > {
    constructor(private recipeService: RecipeDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> {
        return this.recipeService.getRecipe(route.params['id']);
    }
}
