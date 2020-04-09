import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../../common/models/recipe.model';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://ng-recipe-book-5e3a9.firebaseio.com/recipes.json',
        {params: new HttpParams().set('print', 'pretty')}
      );
    }),
    map(recipes => {
      return recipes.map(recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}));
    }),
    map(recipes => new RecipeActions.SetRecipes(recipes))
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes').pipe(map(state => state.recipes))),
    switchMap(([_, recipes]: [RecipeActions.StoreRecipes, Recipe[]]) => {
      return this.http.put<Recipe[]>('https://ng-recipe-book-5e3a9.firebaseio.com/recipes.json', recipes);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
