import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service'; // นำเข้า ApiService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // เพิ่มการอ้างอิงถึงไฟล์ CSS
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) { // นำเข้า ApiService
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator }); // เพิ่มการตรวจสอบรหัสผ่าน
  }

  ngOnInit(): void {}

  // ฟังก์ชันตรวจสอบรหัสผ่านให้ตรงกัน
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // ส่งข้อมูลลงทะเบียนไปยัง API
      this.apiService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          // คุณสามารถเพิ่มการนำทางไปยังหน้าอื่น หรือแสดงข้อความสำเร็จที่นี่
        },
        error => {
          console.error('Registration error', error);
          // คุณสามารถแสดงข้อความแสดงข้อผิดพลาดที่นี่
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
