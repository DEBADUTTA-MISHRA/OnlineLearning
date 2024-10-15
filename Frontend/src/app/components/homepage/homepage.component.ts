import { ViewportScroller } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  contactData = {
    name: '',
    email: '',
    message: ''
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private viewportScroller: ViewportScroller,
  private authService:AuthService,
  private toastr:ToastrService
) {}
  

  scrollToSection(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }

  onSubmit() {
    if (this.contactData.name && this.contactData.email && this.contactData.message) {
      this.authService.contactUs(this.contactData).subscribe(
        (response) => {
          if (response.success) {
            this.toastr.success(response.message);
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          console.error('Error sending message:', error);
          this.toastr.error('Failed to send message');
        }
      );
    } else {
      this.toastr.error('Please fill out all fields.');
    }
  }

}
