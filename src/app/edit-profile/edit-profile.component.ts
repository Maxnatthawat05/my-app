import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService, User } from '../api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: User = {
    id: '',
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    profilePicUrl: ''
  };
  newPassword = '';
  isEditing = false;
  fileName = '';
  selectedImage: File | null = null;
  apiUrl = 'http://192.168.11.221:3001/user/users';
  file: File | null = null;

  public uploader: FileUploader = new FileUploader({
    url: 'http://192.168.11.221:3001/user/users',

    isHTML5: true,
    headers: [
      {
        name: 'Authorization', value: 'Bearer '+ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvIiwidXNlcklkIjoiNjcyYzE3ZWE2NzBmYjAzMTk3ZmE5ZDBiIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MzEyOTAyNTAsImV4cCI6MTczMTM3NjY1MH0.4lsQICzj1yRjLMeB-SfoJfsYvDZ3o7O65pxYJV4Rj_c' // ไม่มีหนิ
      }
    ],
    method: 'PUT', // put sรือ post น่ะ  put ครับ
  });

  constructor(private apiService: ApiService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.loadUserProfile();
    this.setOptionUpload();
  }

  setOptionUpload() {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
    this.uploader.onProgressItem = (progress: any) => {
    };
    this.uploader.onCompleteAll = () => {
      alert('อัพโหลดเสร็จ')
    }
  }

  loadUserProfile() {
    this.apiService.getUserProfile().subscribe(
      (userData: User) => {
        this.user = { ...this.user, ...userData };
        if (userData.profilePicUrl) {
          this.user.profilePicUrl = userData.profilePicUrl;
          localStorage.setItem('profilePicUrl', userData.profilePicUrl);
        }
      },
      (error) => console.error('Error fetching user profile:', error)
    );
  }

  onEdit() {
    this.isEditing = true;
  }

  goBack() {
    this.isEditing = false;
  }

  onSave() {
    const updatedData: User = {
      ...this.user,
      ...(this.newPassword && { password: this.newPassword }) // Include only if newPassword is provided
    };

    // Create FormData to append both user data and the selected image
    const formData = new FormData();
    formData.append('username', updatedData.username || '');
    formData.append('email', updatedData.email || '');
    formData.append('password', updatedData.password || '');

    // Append the selected image if available
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }

    // Send the FormData to the API
    this.apiService.updateProfileWithImage(formData).subscribe(
      (response: any) => { // กำหนดประเภทข้อมูลให้ response
        console.log('Profile updated successfully:', response);
        localStorage.setItem('username', updatedData.username!);
        localStorage.setItem('profilePicUrl', updatedData.profilePicUrl || 'assets/image4.jpg');
        this.isEditing = false;
        this.newPassword = ''; // Clear the temporary password variable
      },
      (error: any) => console.error('Error updating profile:', error) // กำหนดประเภทข้อมูลให้ error
    );
  }


  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage = file;
  //     // You can preview the image if needed
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.user.profilePicUrl = reader.result as string;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileSelected() {
    console.log('event ', this.uploader.queue[0]);
    // const input = event.target as HTMLInputElement;
     if (this.uploader.queue[0]) {
       this.file = this.uploader.queue[0]._file;
     //  this.fileName = this.uploader.queue[0].name;
     }
  }

  uploadFile() {
    this.uploader.uploadAll();
    /* if (this.file) {
       const formData = new FormData();
       formData.append('file', this.file);
 
       this.http.post(this.apiUrl, formData).subscribe({
         next: (response) => {
           console.log('อัปโหลดสำเร็จ', response);
         },
         error: (error) => {
           console.error('เกิดข้อผิดพลาดในการอัปโหลด', error);
         }
       });
     }*/
  }

}
