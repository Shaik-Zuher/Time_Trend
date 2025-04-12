import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";  // Regex for email validation
  isPasswordReset = false; // Track if password is reset
  showForgotPasswordDialog = false; // Toggle the dialog
  isForgotPasswordOpen = false; // Control visibility of forgot password dialog
  securityAnswer = ''; // Store user's security answer
  dialogErrorMessage = ''; // Error message for dialog
  answer = ''; // User input for the answer
  answerMessage = ''; // Error message related to the answer
  newPassword = ''; // New password entered by the user
  confirmPassword = ''; // Confirm password entered by the user
  passwordErrorMessage = ''; // Error message for password mismatch

  constructor(private authService: AuthService, private router: Router) {}

  // Login method
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/watches']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }

  // Navigate to Register page
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  // Open Forgot Password dialog
  openForgotPasswordDialog() {
    this.showForgotPasswordDialog = true;
    this.isForgotPasswordOpen = true;
  }

  // Close Forgot Password dialog
  closeForgotPasswordDialog() {
    this.showForgotPasswordDialog = false;
    this.isForgotPasswordOpen = false;
    this.securityAnswer = ''; // Reset the answer field
    this.dialogErrorMessage = ''; // Clear previous error message
    this.answerMessage = ''; // Reset answer error message
    this.newPassword = ''; // Reset new password field
    this.confirmPassword = ''; // Reset confirm password field
    this.passwordErrorMessage = ''; // Clear password error
  }

  // Verify the security question answer
  verifySecurityAnswer() {
    if (!this.answer) {
      this.answerMessage = 'Please provide an answer to the security question.';
      return;
    }

    // Call the backend to verify the security answer
    this.authService.verifySecurityAnswer(this.username, this.answer).subscribe({
      next: (response) => {
        if (response.isCorrect) {
          this.answerMessage = '';
          // Show the password reset form
          this.isPasswordReset = true; 
        } else {
          this.answerMessage = 'Incorrect answer. Please try again.';
        }
      },
      error: () => {
        this.answerMessage = 'Wrong Answer';
      }
    });
  }

  // Reset the password
  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordErrorMessage = 'Passwords do not match.';
      return;
    }

    // Call backend to reset the password
    this.authService.resetPassword(this.username, this.newPassword).subscribe({
      next: () => {
        this.passwordErrorMessage = '';
        this.closeForgotPasswordDialog(); // Close dialog after success
        alert('Password has been successfully reset.');
        this.router.navigate(['/login']); // Redirect to login page after reset
      },
      error: () => {
        this.passwordErrorMessage = 'An error occurred while resetting your password.';
      }
    });
  }
}
