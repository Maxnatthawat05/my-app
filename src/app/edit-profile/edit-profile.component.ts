import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/profile']); // แทนที่ด้วย path ของหน้าโปรไฟล์
  }

  onSave() {
    console.log('Edited user data:', this.user);
    // ใส่โค้ดที่ต้องการสำหรับการบันทึกข้อมูล เช่น การส่งข้อมูลไปยัง server
    alert('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
  }
}
