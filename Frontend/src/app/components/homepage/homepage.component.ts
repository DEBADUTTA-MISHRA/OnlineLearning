import { ViewportScroller } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private viewportScroller: ViewportScroller) {}

  scrollToSection(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }
}
