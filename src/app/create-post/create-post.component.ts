import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
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

  onSubmit() {
    console.log('Post data:', this.post);
    // เพิ่มฟังก์ชันการส่งข้อมูลที่ต้องการที่นี่ เช่น การส่งข้อมูลไปยัง server
    alert('กระทู้ถูกส่งแล้ว!');
  }
}
