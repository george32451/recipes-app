import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertPlaceholderDirective } from '../shared/directives/alert-placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  @ViewChild(AlertPlaceholderDirective) alertHost: AlertPlaceholderDirective;

  isLoginMode = true;
  isLoading = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.authService.authState.pipe(takeUntil(this.destroy$)).subscribe(authState => {
      this.isLoading = authState.isLoading;
      if (authState.error) this.showErrorAlert(authState.error);
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.authService.signin(email, password);
    } else {
      this.authService.signup(email, password);
    }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
