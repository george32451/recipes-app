import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertPlaceholderDirective } from './directives/alert-placeholder.directive';
import { DropdownDirective } from './directives/dropdown.directive';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    AlertPlaceholderDirective,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    AlertPlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {}
