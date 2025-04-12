import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username = '';
  password = '';
  confirm_password='';
  Security_Question = '';
  message = '';
  passwordMismatch = false;

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'; // Email regex pattern
  constructor(private authService: AuthService, public router: Router) {}

  isValidEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.username);
  }
  validatePasswords(): boolean {
    if (this.password !== this.confirm_password) {
      this.passwordMismatch = true;  // Show the error message
      return false;
    }
    this.passwordMismatch = false;  // Hide the error message if passwords match
    return true;
  }
  register() {
    if (!this.validatePasswords()) {
      this.message = 'Passwords do not match!';
      return;
    }
    if (!this.isValidEmail()) {
      this.message = 'Please enter a valid email address.';
      return;
    }

    this.authService.register(this.username, this.password, this.Security_Question).subscribe({
      next: () => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: () => {
        this.message = 'Email already registered.';
      }
    });
  }
}
