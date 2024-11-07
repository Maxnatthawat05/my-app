import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
  posts = [
    { title: 'หนังตลกที่น่าสนใจ', category: 'funny', content: 'เนื้อหาหนังตลก' },
    { title: 'หนังแอคชั่นมันส์สุด', category: 'action', content: 'เนื้อหาหนังแอคชั่น' },
  ];

  post = {
    title: '',
    category: 'funny',
    content: ''
  };

  // Correcting the type to allow 'none', 'edit', and 'add'
  isEditing: 'none' | 'edit' | 'add' = 'none';
 // Default to 'none' (view mode)
  editingIndex: number | null = null;

  // Method to return the header text based on the editing state
  getHeaderText(): string {
    if (this.isEditing === 'add') {
      return 'เพิ่มกระทู้ใหม่';  // Adding a new post
    } else if (this.isEditing === 'edit') {
      return 'แก้ไขกระทู้';  // Editing an existing post
    } else {
      return 'รายการกระทู้';  // Viewing the list of posts
    }
  }

  // Switch to adding a new post
  startAddPost() {
    this.isEditing = 'add';  // Set state to 'add'
    this.post = { title: '', category: 'funny', content: '' };
    this.editingIndex = null;
  }

  // Switch to editing an existing post
  startEditPost(index: number) {
    this.isEditing = 'edit';  // Set state to 'edit'
    this.editingIndex = index;
    this.post = { ...this.posts[index] };
  }

  // Save the post (new or updated)
  onSave() {
    if (this.editingIndex === null) {
      this.posts.push({ ...this.post });
    } else {
      this.posts[this.editingIndex] = { ...this.post };
    }

    this.isEditing = 'none';  // Switch back to 'none' (view mode)
  }

  // Delete a post
  deletePost(index: number) {
    this.posts.splice(index, 1);
  }

  // Go back (this can be customized to navigate or reset state)
  goBack() {
    this.isEditing = 'none';  // Switch back to 'none' (view mode)
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
    }
  }
}
