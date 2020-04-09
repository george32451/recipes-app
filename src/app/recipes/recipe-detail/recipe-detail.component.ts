import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from 'app/common/models/recipe.model';
import { RecipeService } from 'app/recipes/recipe.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  private id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.route.params
      .pipe(
        map((params: Params) => +params.id),
        tap(id => this.id = id),
        switchMap(id => this.recipeService.getRecipeById(id))
      )
      .subscribe(recipe => this.recipe = recipe);
  }

  onAddToShoppingList() {
    const ingredientsCopy = JSON.parse(JSON.stringify(this.recipe.ingredients));
    this.recipeService.addIngredientsToShoppingList(ingredientsCopy);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
