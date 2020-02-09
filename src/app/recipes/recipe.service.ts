import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Recipe } from 'app/common/models/recipe.model';
import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from 'app/shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged$ = new Subject<Recipe[]>();

  private _recipes: Recipe[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient
  ) {
  }

  get recipes(): Recipe[] {
    return this._recipes.slice();
  }

  getRecipeById(index: number): Recipe {
    return this._recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this._recipes.push(recipe);
    this.recipesChanged$.next(this._recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this._recipes[index] = newRecipe;
    this.recipesChanged$.next(this._recipes.slice());
  }

  deleteRecipe(index: number) {
    this._recipes.splice(index, 1);
    this.recipesChanged$.next(this._recipes.slice());
  }

  storeRecipes(): void {
    this.http.put<Recipe[]>('https://ng-recipe-book-5e3a9.firebaseio.com/recipes.json', this.recipes).subscribe();
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      'https://ng-recipe-book-5e3a9.firebaseio.com/recipes.json',
      {params: new HttpParams().set('print', 'pretty')}
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}));
      }),
      tap(recipes => {
        this._recipes = recipes;
        this.recipesChanged$.next(this._recipes.slice());
      })
    );
  }
}
