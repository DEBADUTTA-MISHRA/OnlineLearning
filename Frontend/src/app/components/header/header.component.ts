import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isNavbarOpen = false; // State to manage navbar visibility

// Method to toggle the navbar
toggleNavbar() {
  this.isNavbarOpen = !this.isNavbarOpen;
}

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToLogIn() {
    this.router.navigate(['/login']);
  }
}
