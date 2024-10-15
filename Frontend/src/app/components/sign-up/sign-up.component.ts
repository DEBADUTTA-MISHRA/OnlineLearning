import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  private clientId = '692415159898-t1na5k530s1ua5maiukj0hhiebb2j0s3.apps.googleusercontent.com';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('gapi-script').then(({ gapi, loadGapiInsideDOM }) => {
        loadGapiInsideDOM().then(() => {
          gapi.load('auth2', () => {
            gapi.auth2.init({
              client_id: this.clientId,
            });
          });
        });
      }).catch((error) => {
        console.error('Error loading gapi-script:', error);
      });
    }
  }

  onSubmit() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.authService.signUp(userData).subscribe(
      (response) => {
        this.toastr.success("User Registered Successfully");
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error(error.message)
        console.error('Error during registration', error);
      }
    );
  }

  signInWithGoogle() {
    if (isPlatformBrowser(this.platformId)) {
      import('gapi-script').then(({ gapi }) => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn().then((googleUser: any) => {
          const idToken = googleUser.getAuthResponse().id_token;
          this.handleGoogleLogin(idToken);
        });
      }).catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
    }
  }

  handleGoogleLogin(idToken: string) {
  this.authService.socialLogin(idToken).subscribe(
    (response) => {
      this.toastr.success("Login successfull");
      localStorage.setItem('token',response.data.token);
      this.router.navigate(['/page'])
    },
    (error) => {
      console.error('Error during Google login:', error);
    }
  );
}

}
