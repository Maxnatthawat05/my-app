import { Component, OnInit } from '@angular/core';
import { ApiService, User } from '../api.service';
import { Router } from '@angular/router';

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
    profilePicUrl: localStorage.getItem('profilePicUrl') || 'assets/image3.jpg'
  };
  newPassword = '';
  isEditing = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
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

    this.apiService.updateProfile(updatedData).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        localStorage.setItem('username', updatedData.username!);
        localStorage.setItem('profilePicUrl', updatedData.profilePicUrl || 'assets/image4.jpg');
        this.isEditing = false;
        this.newPassword = ''; // Clear the temporary password variable
      },
      (error) => console.error('Error updating profile:', error)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file, file.name);
  
      // Send the FormData to the server
      this.apiService.uploadProfilePic(formData).subscribe(
        (response) => {
          console.log('Profile picture updated successfully', response);
          // You can optionally update the UI here with the new profile picture URL.
        },
        (error) => {
          console.error('Error updating profile picture:', error);
        }
      );
    }
  }
  
}
