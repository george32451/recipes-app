import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
  }

  onAddIngredient() {
    const ingredient: Ingredient = new Ingredient(
      this.nameInputRef.nativeElement.value,
      Number(this.amountInputRef.nativeElement.value)
    );
    this.shoppingListService.addIngredient(ingredient);
  }

  onDeleteIngredient() {
    this.shoppingListService.deleteIngredient(this.nameInputRef.nativeElement.value);
  }

}
