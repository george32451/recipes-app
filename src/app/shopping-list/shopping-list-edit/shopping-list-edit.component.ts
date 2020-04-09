import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('addIngredientForm') addIngredientForm: NgForm;
  editIngredientSub: Subscription;
  editMode = false;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editIngredientSub = this.shoppingListService.shoppingListState$
      .pipe(
        tap(state => this.editMode = state.editedIngredientIndex > -1),
        filter(state => !!state.editedIngredient)
      )
      .subscribe(state => {
        this.addIngredientForm.setValue({
          ingredientName: state.editedIngredient.name,
          ingredientAmount: state.editedIngredient.amount,
        });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addIngredientForm.setValue({ ingredientAmount: 1, ingredientName: '' }));
  }

  onSubmit(): void {
    const ingredient: Ingredient = new Ingredient(
      this.addIngredientForm.value.ingredientName,
      +this.addIngredientForm.value.ingredientAmount
    );

    if (this.editMode) {
      this.shoppingListService.updateIngredient(ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.onResetForm();
  }

  onDeleteIngredient(): void {
    this.shoppingListService.deleteIngredient();
    this.onResetForm();
  }

  onResetForm(): void {
    this.editMode = false;
    this.addIngredientForm.reset({ ingredientAmount: 1 });
    this.shoppingListService.stopEdit();
  }

  ngOnDestroy(): void {
    if (this.editIngredientSub) {
      this.editIngredientSub.unsubscribe();
    }
    this.onResetForm();
  }

}
