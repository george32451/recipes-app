import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() changeView = new EventEmitter<string>();

  collapsed = true;

  onNavbarToggle() {
    this.collapsed = !this.collapsed;
  }

  onSelect(view: string) {
    this.changeView.emit(view);
  }
}
