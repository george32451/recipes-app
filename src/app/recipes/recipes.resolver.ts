import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from '../common/models/recipe.model';
import { RecipeService } from './recipe.service';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolver implements Resolve<Recipe[]> {
  constructor(private recipeService: RecipeService, private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Recipe[] {
    return this.recipeService.recipes.pipe(
      take(1),
      switchMap(recipes => {
        if (!recipes.length) {
          this.recipeService.fetchRecipes();
          return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
        }
        return of(recipes);
      })
    );
  }
}
