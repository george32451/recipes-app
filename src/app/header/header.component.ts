import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  isAuthenticated$: Observable<boolean>;

  constructor(private recipeService: RecipeService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.user.pipe(map(user => !!user));
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

  onLogout() {
    this.authService.logout();
  }
}
