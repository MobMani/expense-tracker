import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    if (!this.username || !this.password) {
      this.error = 'Enter both a username and a password.';
      return;
    }
    const ok = this.auth.login(this.username, this.password);
    if (!ok) {
      this.error = 'Username or password is incorrect.';
      return;
    }
    this.router.navigate(['/contributors']);
  }
}
