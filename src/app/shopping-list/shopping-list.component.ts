import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Ingredient } from 'app/common/models/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<Ingredient[]>;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients$ = this.shoppingListService.ingredients$;
  }

  onEditIngredient(index: number) {
    this.shoppingListService.startEdit(index);
  }
}
