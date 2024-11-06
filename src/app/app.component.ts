import { Component } from '@angular/core';
import { Router } from '@angular/router'; // นำเข้า Router

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {} // สร้าง constructor

  navigateToProfile() {
    this.router.navigate(['/profile']); // เปลี่ยนเส้นทางไปยังหน้าโปรไฟล์
    this.router.navigate(['/login']);
  }
}
