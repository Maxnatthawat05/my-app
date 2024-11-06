import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// กำหนด interface สำหรับข้อมูลผู้ใช้
export interface User {
  username?: string; // ปรับให้เป็น optional ถ้าใช้ username
  email: string;
  password: string;
}

export interface Category {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiRegisterUrl = 'http://192.168.11.221:3001/api/register'; // URL ของ API ลงทะเบียน
  private apiLoginUrl = 'http://192.168.11.221:3001/api/login'; // URL ของ API ล็อกอิน
  private apiCategoriesUrl = 'http://192.168.11.221:3001/category/categories'; // URL ของ API สำหรับหมวดหมู่

  constructor(private http: HttpClient) { }

  // ฟังก์ชันดึง Token จาก localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    console.log('Token from localStorage:', token);
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '' // เพิ่ม Token ใน Header ถ้ามี
    });
  }

  // ฟังก์ชันเก็บ Token หลังจากผู้ใช้ล็อกอิน
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token); // เก็บ Token ลงใน localStorage
  }

  // ฟังก์ชันลบ Token เมื่อผู้ใช้ออกจากระบบ
  removeToken(): void {
    localStorage.removeItem('accessToken'); // ลบ Token ออกจาก localStorage
  }

  // ส่งคำขอ POST สำหรับลงทะเบียนผู้ใช้
  register(data: User): Observable<any> {
    const headers = this.getAuthHeaders(); // ใช้ฟังก์ชัน getAuthHeaders ในการดึง Token
    return this.http.post<any>(this.apiRegisterUrl, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ส่งคำขอ POST สำหรับล็อกอินผู้ใช้
  login(data: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // เพิ่ม Content-Type เป็น application/json
    });
    return this.http.post<any>(this.apiLoginUrl, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ดึงข้อมูลหมวดหมู่ทั้งหมดจาก API
  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders(); // ใช้ฟังก์ชัน getAuthHeaders ในการดึง Token
    return this.http.get<Category[]>(this.apiCategoriesUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // เพิ่มหมวดหมู่ใหม่
  addCategory(category: Category): Observable<any> {
    const headers = this.getAuthHeaders(); // ใช้ฟังก์ชัน getAuthHeaders ในการดึง Token
    return this.http.post(this.apiCategoriesUrl, category, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ลบหมวดหมู่
  deleteCategory(categoryName: string): Observable<any> {
    const headers = this.getAuthHeaders(); // ใช้ฟังก์ชัน getAuthHeaders ในการดึง Token
    return this.http.delete(`${this.apiCategoriesUrl}/${categoryName}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // อัปเดตหมวดหมู่
  updateCategory(updatedCategory: Category, oldCategoryName: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // ส่งคำขอ PUT ไปยัง API เพื่ออัปเดตหมวดหมู่
    return this.http.put(`http://192.168.11.221:3001/category/categories/${oldCategoryName}`, updatedCategory, { headers });
  }


  // ฟังก์ชันจัดการข้อผิดพลาด
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // ข้อผิดพลาดเกิดจากฝั่งผู้ใช้
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // ข้อผิดพลาดเกิดจากฝั่งเซิร์ฟเวอร์
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage); // ส่งคืนข้อความข้อผิดพลาด
  }
}
