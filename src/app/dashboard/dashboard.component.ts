import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    // Perform logout logic here (e.g., clearing session or token)
    // Redirect to the login page after logout
    this.router.navigate(['/login']);
  }
}
