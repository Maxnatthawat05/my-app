import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  password: string;
  profilePicUrl?: string;
}

export interface Category {
  name: string;
}

export interface Post {
  title: string;
  author: {
    username: string;
    photo?: string;
  };
  truncatedContent: string;
  fullContent: string;
  contentWordCount: number;
  isExpanded: boolean; // เพิ่มคุณสมบัตินี้
  comments: string[];
  photoUrl?: string;
  datePosted: Date; // วันและเวลาโพสต์
  createdAt: string; 
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRegisterUrl = 'http://192.168.31.33:3001/api/register';
  private apiLoginUrl = 'http://192.168.31.33:3001/api/login';
  private apiCategoriesUrl = 'http://192.168.31.33:3001/category/categories';
  private apiPostsUrl = 'http://192.168.31.33:3001/api/posts';
  private apiUserUrl = 'http://192.168.31.33:3001/user'; // Update to this


  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
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
    const headers = this.getAuthHeaders();
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

  getComments(postId: string): Observable<any> {
    return this.http.get(`${this.apiPostsUrl}/posts/${postId}/comments`);
  }

  addComment(postId: string, commentData: any): Observable<any> {
    return this.http.post(`${this.apiPostsUrl}/posts/${postId}/comments`, commentData);
  }

// Method to update the user profile
updateProfile(updatedData: User): Observable<any> {
  const headers = this.getAuthHeaders();  // Get authorization headers
  return this.http.put(`${this.apiUserUrl}/users/`, updatedData, { headers }).pipe(
    catchError(this.handleError)
  );
}


  getUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders(); // Token is included in the headers
    return this.http.get<User>(`${this.apiUserUrl}`, { headers }).pipe( // Assuming the API endpoint is '/profile'
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
}
