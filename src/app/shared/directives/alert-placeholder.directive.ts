import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAlertPlaceholder]'
})
export class AlertPlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
