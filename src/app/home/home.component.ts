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
        console.log('Posts from API:', posts);
        this.posts = posts;
      },
      (error) => {
        console.error('Error fetching posts:', error);
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
    const userId = localStorage.getItem('userId');  // Retrieve userId from localStorage
    const postId = this.selectedPost.id;            // The postId is from the selected post
  
    if (!userId || !postId) {
      console.error('Missing authorId or postId');  // Check if userId or postId is missing
      return;  // Prevent sending the comment if ids are missing
    }
  
    if (this.newComment.trim()) {
      const comment = {
        content: this.newComment.trim(),
        authorId: userId,  // Use userId as authorId
        postId: postId     // Use the selected post's id
      };
  
      // Log the payload for debugging
      console.log('Comment Payload:', comment);
  
      // Call the ApiService with the necessary data
      this.apiService.addComment(comment).subscribe(
        (response: any) => {
          // On success, add the comment to the selected post's comment list
          this.selectedPost.comments.push(response);
          this.newComment = '';  // Reset the comment input field
          this.isCommentModalVisible = false;  // Close the comment modal
        },
        (error: any) => {
          console.error('Error adding comment:', error);  // Log error details
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
