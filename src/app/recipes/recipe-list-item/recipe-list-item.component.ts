import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from 'app/common/models/recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.css']
})
export class RecipeListItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() id: number;

  ngOnInit() {
  }

}
