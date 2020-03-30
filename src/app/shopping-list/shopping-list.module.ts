import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  { path: '', component: ShoppingListComponent },
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
})
export class ShoppingListModule {}
