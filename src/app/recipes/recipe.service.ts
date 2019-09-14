import { Injectable } from '@angular/core';

import { Recipe } from 'app/common/models/recipe.model';
import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from 'app/shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
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

  constructor(private shoppingListService: ShoppingListService) { }

  get getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
