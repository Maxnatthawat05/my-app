import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service'; // นำเข้า ApiService
import { Router } from '@angular/router'; // นำเข้า Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;  // ใช้เพื่อแสดงสถานะการโหลด

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService, 
    private router: Router
  ) {
    // สร้างฟอร์มสำหรับการล็อกอิน
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // ใช้ email แทน username
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // ตรวจสอบว่า accessToken และ userRole มีอยู่ใน localStorage หรือไม่
    const accessToken = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    // ถ้ามี accessToken และ userRole ใน localStorage ให้นำทางไปที่หน้า dashboard โดยไม่ต้องล็อกอินใหม่
    if (accessToken && userRole) {
      this.router.navigate(['/dashboard']);
    }
  }

  // เมื่อผู้ใช้กดส่งฟอร์ม
  // login.component.ts
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Form:', this.loginForm.value);
  
      this.apiService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login successful:', response);
  
          const token = response.accessToken;
          const role = response.role;
          const userId = response.userid;  // ใช้ `userid` ที่ได้รับจาก API
          const username = response.username;
          const email = response.emailL || response.email;  // คำนึงถึงชื่อคีย์ใน API ("emailL" ในที่นี้)
          const profilePicUrl = response.profilePicUrl || 'assets/image4.jpg';
  
          // เก็บข้อมูลลงใน localStorage
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId);  // เก็บ userId ใน localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('email', email);
          localStorage.setItem('profilePicUrl', profilePicUrl);
  
          // ตรวจสอบการเก็บข้อมูล
          console.log('User ID stored in localStorage:', localStorage.getItem('userId'));
  
          // นำทางไปที่หน้า Dashboard
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'USER') {
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Invalid role');
          }
        },
        error => {
          console.error('Login error:', error);
          alert('Login failed: ' + error.message);
        }
      );
    } else {
      alert('Please fill in all fields correctly');
    }
  }
  
}
