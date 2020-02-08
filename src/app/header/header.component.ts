import { Component } from '@angular/core';

import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  collapsed = true;

  constructor(private recipeService: RecipeService) {
  }

  onNavbarToggle() {
    this.collapsed = !this.collapsed;
  }

  onSave() {
    this.recipeService.storeRecipes();
  }

  onFetch() {
    this.recipeService.fetchRecipes().subscribe();
  }
}
