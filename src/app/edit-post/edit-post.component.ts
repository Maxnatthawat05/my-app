import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Post {
  id: string;
  title: string;
  content: string;
  file: null | string;
  authorId: string;
  categoryId: string;
  createdAt: string;
  author: Author;
  category: Category;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface Author {
  id: string;
  username: string;
  email: string;
  password: string;
  photo: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  posts: Post[] = [];
  categories: Category[] = [];  // เพิ่มตัวแปรเก็บหมวดหมู่
  isEditing = false;
  isAdding = false;
  newPost: any = null;
  selectedPost: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // เรียก API เพื่อดึงข้อมูลโพสต์
    this.http.get<Post[]>('http://192.168.11.221:3001/post/posts/user', { headers })
      .subscribe(
        posts => {
          this.posts = posts;
        },
        error => {
          console.error('Error fetching posts:', error);
        }
      );

    // เรียก API เพื่อดึงข้อมูลหมวดหมู่
    this.http.get<Category[]>('http://192.168.11.221:3001/category/categories', { headers })
      .subscribe(
        categories => {
          this.categories = categories;  // เก็บข้อมูลหมวดหมู่ลงในตัวแปร categories
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
  }

  editPost(post: any) {
    this.selectedPost = { ...post };
    this.isEditing = true;
  }

  savePost() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<Post>(`http://192.168.11.221:3001/post/posts/${this.selectedPost.id}`, this.selectedPost, { headers })
      .subscribe(
        updatedPost => {
          const index = this.posts.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
          this.isEditing = false;
          this.selectedPost = null;
        },
        error => {
          console.error('Error updating post:', error);
        }
      );
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedPost = null;
  }

  deletePost(postId: string) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://192.168.11.221:3001/post/posts/${postId}`, { headers })
      .subscribe(
        () => {
          this.posts = this.posts.filter(post => post.id !== postId);
        },
        error => {
          console.error('Error deleting post:', error);
        }
      );
  }

  openAddPostForm() {
    this.isAdding = true;
    this.newPost = { ...this.newPost, title: '', content: '', categoryId: '' };  // รีเซ็ตข้อมูลโพสต์ใหม่
  }

  saveNewPost() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userId = localStorage.getItem('userId') || '';   // Retrieve userId from localStorage
    const formData = new FormData();
  
    // Add post data
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    formData.append('categoryId', this.newPost.categoryId);  // Ensure categoryId is available
    formData.append('authorId', userId);  // Add authorId to the form data
  
    // Check and append file if it exists
    if (this.newPost.file) {
      formData.append('file', this.newPost.file);
    }
  
    // Make the API request to save the new post
    this.http.post<Post>('http://192.168.11.221:3001/post/posts', formData, { headers })
      .subscribe(
        (newPost) => {
          this.posts.push(newPost);  // Add new post to posts array
          this.isAdding = false;  // Close the form
          this.newPost = {
            title: '',
            content: '',
            file: null,
            authorId: '',  // Reset authorId
            categoryId: '',  // Reset categoryId
          };
        },
        (error) => {
          console.error('Error saving new post:', error);
          console.log(this.newPost);  // Log current newPost state for debugging
        }
      );
  }
  

  cancelAddPost() {
    this.isAdding = false;
    this.newPost = null;
  }
}
