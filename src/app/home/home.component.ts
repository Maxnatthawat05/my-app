import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Category, Post } from '../api.service'; // นำเข้า ApiService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  isDropdownVisible = false;
  isCommentModalVisible = false;
  newComment = '';
  selectedPost: any = {};

  categories: Category[] = [];
  posts: Post[] = []; // ปรับ posts เป็นแบบ dynamic โดยใช้ข้อมูลจาก API

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCategories(); // ดึงข้อมูลหมวดหมู่เมื่อ component ถูกสร้าง
    this.getPosts(); // ดึงข้อมูลโพสต์เมื่อ component ถูกสร้าง
  }

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  getCategories() {
    this.apiService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories; // เก็บข้อมูลหมวดหมู่ในตัวแปร categories
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  // ฟังก์ชันดึงข้อมูลโพสต์จาก ApiService
  getPosts() {
    this.apiService.getPosts().subscribe(
      (posts: Post[]) => {
        this.posts = posts.map(post => ({
          ...post,
          isExpanded: false,
          imageUrl: post.photoUrl || 'assets/default-image.jpg', // หากไม่มีรูปภาพ ให้ใช้ภาพเริ่มต้น
          datePosted: post.createdAt ? new Date(post.createdAt) : new Date(), // ใช้วันที่จาก API หรือวันที่ปัจจุบัน
          authorName: post.author.username || 'Unknown', // เพิ่มชื่อผู้โพสต์
          comments: post.comments || [],
          content: post.content || '',
          contentWordCount: post.content ? post.content.split(' ').length : 0, // คำนวณจำนวนคำ
        }));
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }
  
  

  navigateToProfile(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  selectCategory(category: string) {
    console.log(`Selected category: ${category}`);
    this.isDropdownVisible = false; // ซ่อน dropdown หลังจากเลือกหมวดหมู่
  }

  toggleContent(index: number) {
    this.posts[index].isExpanded = !this.posts[index].isExpanded;
  }

  showCommentModal(index: number) {
    this.selectedPost = this.posts[index];
    this.isCommentModalVisible = true;
  }

  closeCommentModal() {
    this.isCommentModalVisible = false;
  }

  // home.component.ts

addComment() {
  const username = localStorage.getItem('username') || 'Guest';  // Retrieve username from localStorage or set 'Guest'

  if (this.newComment.trim()) {
    const comment = {
      content: this.newComment.trim(),
      author: { username: username }  // Use the logged-in username
    };

    // Call the correct API method and pass the API URL and the comment data
    this.apiService.addComment('', comment).subscribe(
      (response: any) => {
        // On success, add the comment to the selected post's comment list
        this.selectedPost.comments.push(response);
        this.newComment = '';  // Reset the comment input
        this.isCommentModalVisible = false;  // Close the comment modal
      },
      (error: any) => {
        console.error('Error adding comment:', error);  // Add error handling
      }
    );
  }
}

  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }
}
