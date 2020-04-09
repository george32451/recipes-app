import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from 'app/common/models/recipe.model';
import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from 'app/shopping-list/shopping-list.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {
  }

  get recipes(): Observable<Recipe[]> {
    return this.store.select('recipes').pipe(map(state => state.recipes));
  }

  getRecipeById(index: number): Observable<Recipe> {
    return this.store.select('recipes')
      .pipe(
        map(state => state.recipes.find((_, i) => i === index)),
        take(1)
      );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe): void {
    this.store.dispatch(new RecipeActions.AddRecipe(recipe));
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.store.dispatch(new RecipeActions.UpdateRecipe({ index, recipe }));
  }

  deleteRecipe(index: number) {
    this.store.dispatch(new RecipeActions.DeleteRecipe(index));
  }

  storeRecipes(): void {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  fetchRecipes(): void {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
}
