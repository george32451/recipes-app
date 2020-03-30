import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeListItemComponent } from './recipe-list-item/recipe-list-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RecipesComponent,
    RecipeStartComponent,
    RecipeListItemComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeEditComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RecipesRoutingModule
  ]
})
export class RecipesModule {}
