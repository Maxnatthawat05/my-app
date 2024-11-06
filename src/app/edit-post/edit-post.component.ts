import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
  post = {
    category: '',
    title: '',
    content: '',
    file: null as File | null
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.post.file = input.files[0];
    }
  }

  onSave() {
    console.log('Edited post data:', this.post);
    // ใส่โค้ดที่ต้องการสำหรับการบันทึกการแก้ไขข้อมูลที่นี่ เช่น การส่งข้อมูลไปยัง server
    alert('บันทึกการแก้ไขกระทู้เรียบร้อยแล้ว!');
  }
}
