import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Ingredient } from 'app/common/models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged$ = new Subject<Ingredient[]>();
  startedEditing$ = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ];

  constructor() { }

  get getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient, publishChanges = true) {
    const index = this.ingredients.findIndex(ing => ing.name.toLowerCase() === ingredient.name.toLowerCase());
    if (index === -1) {
      this.ingredients.push(ingredient);
    } else {
      this.ingredients[index].amount += ingredient.amount;
    }
    if (publishChanges) {
      this.ingredientsChanged$.next(this.ingredients.slice());
    }
  }

  addIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(ing => this.addIngredient(ing, false));
    this.ingredientsChanged$.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged$.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged$.next(this.ingredients.slice());
  }
}
