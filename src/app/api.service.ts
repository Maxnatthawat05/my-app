// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  password?: string; // Make password optional
  photo?: string ;
  photoUrl?: string ;
}

export interface Category {
  id: string;

  name: string;
}

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
  datePosted?: string;  // เพิ่ม datePosted
  contentWordCount?: number;  // เพิ่ม contentWordCount
  isExpanded?: boolean;  // เพิ่ม isExpanded
  photoUrl?: string;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
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

interface posts {
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
  photoUrl: null | string;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  author: Author2;
}

interface Author2 {
  id: string;
  username: string;
  email: string;
  password: string;
  photo: null | null | string | string;
  role: string;
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

interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  author: Author2;
}

interface Author2 {
  id: string;
  username: string;
  email: string;
  password: string;
  photo: null | string | string;
  role: string;
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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRegisterUrl = 'http://192.168.11.221:3001/api/register';
  private apiLoginUrl = 'http://192.168.11.221:3001/api/login';
  private apiCategoriesUrl = 'http://192.168.11.221:3001/category/categories';
  private apiPostsUrl = 'http://192.168.11.221:3001/api/posts';
  private apiUserUrl = 'http://192.168.11.221:3001/user/users'; // User API endpoint
  private apiCommentsUrl = 'http://192.168.11.221:3001/comment/comments'; // Ensure this is the correct URL
  


  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No token found, check localStorage!');
    }
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('accessToken');
  }

  register(data: User): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiRegisterUrl, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  login(data: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiLoginUrl, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(this.apiCategoriesUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getPosts(): Observable<Post[]> {
    const headers = this.getAuthHeaders(); // Headers are set here
    return this.http.get<Post[]>(this.apiPostsUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  addCategory(category: Category): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiCategoriesUrl, category, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(categoryName: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiCategoriesUrl}/${categoryName}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(updatedCategory: Category, oldCategoryName: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiCategoriesUrl}/${oldCategoryName}`, updatedCategory, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to add a comment to a post
  addComment(commentData: any): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');  // Set headers
  
    // Log the request data and headers for debugging
    console.log('Comment API Request:', commentData, headers);
  
    return this.http.post(this.apiCommentsUrl, commentData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  // Method to update user profile
  updateProfile(updatedData: User): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(this.apiUserUrl, updatedData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(this.apiUserUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


  updateProfileWithImage(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    console.log(formData);
    return this.http.put(`${this.apiUserUrl}`, formData, { headers });
  }
}
