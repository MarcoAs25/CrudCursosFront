import { AfterViewInit, ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  screenWidth: number;
  listItem = [
    {
      url: '/course',
      title: 'Course',
      icon: 'book'
    },
    {
      url: '/category',
      title: 'Category',
      icon: 'category'
    }
  ]

  @ViewChild('drawer') sidenav: MatSidenav;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngAfterViewInit() {
    this.screenWidth = window.innerWidth;
    this.setSidenavMode();
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.setSidenavMode();
  }
  setSidenavMode() {
    if (this.screenWidth < 680) {
      this.sidenav.mode = 'over';
    } else {
      this.sidenav.mode = 'side';
    }
  }
  checkUrlActive(link: any): boolean {
    const currentUrl = this.router.url;
    const linkUrl = link.url;
    return currentUrl.endsWith(linkUrl);
  }
}
