import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Ingredient } from 'app/common/models/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private store: Store<fromApp.AppState>) { }

  get ingredients$(): Observable<Ingredient[]> {
    return this.store.select('shoppingList').pipe(
      map(shoppingList => shoppingList.ingredients)
    );
  }

  get shoppingListState$(): Observable<fromShoppingList.State> {
    return this.store.select('shoppingList');
  }

  addIngredient(ingredient: Ingredient): void {
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  updateIngredient(ingredient: Ingredient): void {
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
  }

  deleteIngredient(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
  }

  startEdit(index: number): void {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  stopEdit(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
