import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Recipe } from 'app/common/models/recipe.model';
import { RecipeService } from 'app/recipes/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.recipe = this.recipeService.getRecipeById(+params.id);
    });
  }

  onAddToShoppingList() {
    const ingredientsCopy = JSON.parse(JSON.stringify(this.recipe.ingredients));
    this.recipeService.addIngredientsToShoppingList(ingredientsCopy);
  }

}
