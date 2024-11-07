import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  isUserLoggedIn: boolean = false;  // สถานะการล็อกอินของผู้ใช้

  constructor(private router: Router) { }

  ngOnInit() {
    // ดึงข้อมูล userRole และ accessToken จาก localStorage
    const userRole = localStorage.getItem('userRole');  // ใช้ชื่อ key ว่า 'role'
    const accessToken = localStorage.getItem('accessToken');
  
    // ตรวจสอบว่า accessToken และ userRole มีอยู่ใน localStorage หรือไม่
    if (accessToken && userRole) {
      console.log('User role from localStorage:', userRole);  // พิมพ์ค่า userRole ในคอนโซล
  
      // ตรวจสอบว่า role เป็น 'ADMIN' หรือไม่
      if (userRole === 'ADMIN') {
        this.isAdmin = true;  // ถ้าเป็นแอดมิน ให้ตั้งค่า isAdmin เป็น true
        console.log('Admin access granted');
      } else if (userRole === 'USER') {
        this.isAdmin = false;  // ถ้าเป็นผู้ใช้ทั่วไป ให้ตั้งค่า isAdmin เป็น false
        console.log('User access granted');
      } else {
        console.log('Access denied: Invalid role');
        this.router.navigate(['/login']);  // ถ้า role ไม่ถูกต้อง ให้นำทางไปหน้า login
        return; // เพิ่มการออกจากฟังก์ชันหาก role ไม่ถูกต้อง
      }
  
      this.isUserLoggedIn = true;  // ตั้งค่าสถานะผู้ใช้ที่ล็อกอินแล้ว
    } else {
      console.log('No access token or role found, redirecting to login');
      this.router.navigate(['/login']);  // หากไม่มี accessToken หรือ userRole ให้นำทางไปหน้า login
    }
  }
  

  logout() {
    // ลบข้อมูลจาก localStorage เมื่อผู้ใช้ทำการออกจากระบบ
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole'); // ลบข้อมูล role ด้วย

    // นำทางไปยังหน้า login
    console.log('User logged out, redirecting to login');
    this.router.navigate(['/login']);
  }
}
