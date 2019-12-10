import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Recipe } from 'app/common/models/recipe.model';
import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from 'app/shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged$ = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'First Test Recipe',
      'Simple description',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Potato', 5),
      ]
    ),
    new Recipe(
      'Second Test Recipe',
      'Simple description',
      'https://cdn.pixabay.com/photo/2018/12/22/16/36/recipe-3889916_960_720.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Lime', 1),
      ]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) {
  }

  get getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged$.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged$.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged$.next(this.recipes.slice());
  }
}
