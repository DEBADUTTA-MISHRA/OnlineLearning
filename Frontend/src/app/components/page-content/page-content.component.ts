import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss'
})
export class PageContentComponent {
  userName: string = '';
  isProfileUpdate: boolean = false;
  isDropdownOpen: boolean = false;
  isNavbarOpen: boolean = false;
  profileData: any = {
    name: '',
    email: '',
    bio: '',
    role: ''
  };


  constructor(private authService: AuthService,private elementRef: ElementRef, private router: Router,private toastr:ToastrService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.toastr.success("user Profile fetched successfully!");
        this.userName = res.user.name;
        this.profileData = res.user;
      },
      error: (err) => {
        this.toastr.error("Error fetching user profile");
        console.error('Error fetching user profile', err);
      }
    });
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

   showUpdateProfile(): void {
    this.isProfileUpdate = true;
    this.isDropdownOpen = false;
  }

  onSubmit(): void {
    this.authService.updateUserProfile(this.profileData).subscribe({
      next: (res) => {
        this.toastr.success("Profile updated successfully");
        this.isProfileUpdate = false;
        this.getUserProfile();
      },
      error: (err) => {
        this.toastr.error("Error updating profile");
        console.error('Error updating profile', err);
      }
    });
  }

  cancelUpdate(): void {
    this.isProfileUpdate = false;
    this.getUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  scrollToCourses() {
    const element = this.elementRef.nativeElement.querySelector('#courseManagement');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
