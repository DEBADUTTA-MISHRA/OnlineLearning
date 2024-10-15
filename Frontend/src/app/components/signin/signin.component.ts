import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  forgotPassword: boolean = false;
  resetEmail: string='';
  otp: string='';
  newPassword: string='';
  otpSent: boolean = false;

  passwordFieldType: string = 'password';

  constructor(private authService:AuthService, private toastr:ToastrService, private router:Router){}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
}

  onSubmit() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.authService.signIn(credentials).subscribe(
      (response) => {
        this.toastr.success("Login Successfull");
        localStorage.setItem('token', response.data.token);
        this.router.navigate(['/page']);
      },
      (error) => {
        this.toastr.error("Login Failed");
        console.error('Error during login', error);
      }
    );
  }

  toggleForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
    this.resetEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.otpSent = false;
  }

  sendOtp() {
    if (this.resetEmail) {
      this.authService.forgotPassword(this.resetEmail).subscribe(response => {
        console.log(response);
        this.otpSent = true;
        this.toastr.success("OTP sent successfully!!");
      }, error => {
        this.toastr.error("Error sending OTP");
        console.error('Error sending OTP:', error);
      });
    }
  }

  resetPassword() {
    const resetData = {
      email: this.resetEmail,
      otp: this.otp,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(resetData).subscribe(response => {
      this.toastr.success("Password reset successfully");
      this.toggleForgotPassword();
    }, error => {
      console.error('Error resetting password:', error);
    });
  }

}
