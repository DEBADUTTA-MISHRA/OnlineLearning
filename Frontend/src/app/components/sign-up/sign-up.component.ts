import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService:AuthService, private toastr:ToastrService, private router:Router){}

  onSubmit() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.authService.signUp(userData).subscribe(
      (response) => {
        this.toastr.success("User Registered Successfully");
        console.log('User registered successfully', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error(error.message)
        console.error('Error during registration', error);
      }
    );
  }
}
