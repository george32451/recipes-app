import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth-response-data.interface';
import { AlertComponent } from '../common/alert/alert.component';
import { AlertPlaceholderDirective } from '../common/directives/alert-placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @ViewChild(AlertPlaceholderDirective) alertHost: AlertPlaceholderDirective;

  isLoginMode = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let auth$: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      auth$ = this.authService.signin(email, password);
    } else {
      auth$ = this.authService.signup(email, password);
    }

    auth$.pipe(finalize(() => this.isLoading = false))
      .subscribe(
        () => this.router.navigate(['/recipes']),
        (errorMessage: string) => this.showErrorAlert(errorMessage)
      );

    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory<AlertComponent>(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent<AlertComponent>(alertComponentFactory);

    componentRef.instance.message = message;
    componentRef.instance.closeEvent.pipe(take(1)).subscribe(() => {
      hostViewContainerRef.clear();
    });
  }
}
