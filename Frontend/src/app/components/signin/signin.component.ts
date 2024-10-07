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

  constructor(private authService:AuthService, private toastr:ToastrService, private router:Router){}

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
}
