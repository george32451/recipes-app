import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth-response-data.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;

  constructor(private authService: AuthService, private router: Router) {
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
        (errorMessage: string) => this.errorMessage = errorMessage
      );

    form.reset();
  }
}
