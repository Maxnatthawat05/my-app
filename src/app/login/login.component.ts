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

  // เมื่อผู้ใช้กดส่งฟอร์ม
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      // ส่งข้อมูลเข้าสู่ระบบที่นี่
      this.apiService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login successful', response);

          // สมมติว่า Token ที่ได้รับมาจากการตอบกลับของ API อยู่ใน response.token
          const token = response.accessToken;

          // เก็บ Token ลงใน localStorage (หรือ sessionStorage)
          localStorage.setItem('accessToken', token);
          console.log('Token stored in localStorage:', localStorage.getItem('accessToken'));
          

          // ตรวจสอบ role ของผู้ใช้
          const role = response.role; // ดึง role ของผู้ใช้จาก response
          if (role === 'ADMIN') { // เปลี่ยนตามโครงสร้างของ response
            this.router.navigate(['/dashboard']); // นำทางไปยังหน้า dashboard
          } else if (role === 'USER') {
            this.router.navigate(['/home']); // นำทางไปยังหน้า home สำหรับผู้ใช้ทั่วไป
          } else {
            console.log('Access denied: Invalid role');
            // คุณสามารถแสดงข้อความแจ้งเตือนหรือทำการนำทางไปยังหน้าอื่นได้
          }
        },
        error => {
          console.error('Login error', error);
          // แสดงข้อความข้อผิดพลาดที่นี่
          alert('Login failed: ' + error); // แสดงข้อผิดพลาดสำหรับการล็อกอิน
        }
      );
    } else {
      console.log('Form is invalid');
      alert('Please fill in all fields correctly'); // แสดงข้อผิดพลาดเมื่อฟอร์มไม่ถูกต้อง
    }
  }
}
