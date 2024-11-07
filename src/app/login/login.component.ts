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
    console.log('Login Form:', this.loginForm.value);  // ตรวจสอบข้อมูลที่ถูกส่งไป
    this.apiService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Login successful:', response);  // ตรวจสอบการตอบกลับจาก API

        const token = response.accessToken;
        const role = response.role;
        const username = response.username;
        const email = response.emailL;
        console.log(role);
        console.log(token);
        console.log(username);
        console.log(response.emailL);
        const profilePicUrl = response.profilePicUrl || 'assets/image4.jpg';
        // ตรวจสอบว่า token และ role ถูกส่งกลับมาจาก API หรือไม่
        if (token && role) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('username', username);
          localStorage.setItem('email', email);
          localStorage.setItem('profilePicUrl', profilePicUrl); 
          console.log(localStorage.getItem('email'));
          // นำทางไปยังหน้า dashboard
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'USER') {
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Invalid role');
          }
        } else {
          console.log('Missing token or role in response');
          alert('Login failed: Invalid response');
        }
      },
      error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error);
      }
    );
  } else {
    alert('Please fill in all fields correctly');
  }
}
}
