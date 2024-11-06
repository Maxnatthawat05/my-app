import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

// ประกาศ interface Category
export interface Category {
  name: string;
}

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: string[] = []; // รายการหมวดหมู่ที่มีอยู่
  newCategoryName: string = ''; // ตัวแปรเก็บชื่อหมวดหมู่ใหม่
  isEditing: boolean = false; // สถานะการแก้ไข
  categoryToEdit: string | null = null; // หมวดหมู่ที่กำลังแก้ไข

  // Inject ApiService เข้าไปใน constructor
  constructor(private apiService: ApiService, private router: Router) {}

  // Implement ngOnInit to call getCategories on component initialization
  ngOnInit() {
    this.getCategories(); // Fetch categories when component is initialized
  }

  // ฟังก์ชันเพิ่มหมวดหมู่ใหม่
  addNewCategory() {
    const newCategory: Category = { name: this.newCategoryName };

    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    this.apiService.addCategory(newCategory).subscribe(
      (response: any) => {
        console.log('หมวดหมู่ถูกเพิ่มแล้ว', response);
        this.getCategories(); // Refresh categories list
        this.newCategoryName = ''; // เคลียร์ชื่อหมวดหมู่หลังจากเพิ่ม
      },
      (error: HttpErrorResponse) => {
        console.error('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่', error);
      }
    );
  }

  // ฟังก์ชันลบหมวดหมู่
  removeCategory(categoryName: string) {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    this.apiService.deleteCategory(categoryName).subscribe(
      (response: any) => {
        console.log('หมวดหมู่ถูกลบแล้ว', response);
        this.getCategories(); // Refresh categories list
      },
      (error: HttpErrorResponse) => {
        console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่', error);
      }
    );
  }

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  getCategories() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    this.apiService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories.map(category => category.name);
        console.log('หมวดหมู่ทั้งหมด:', this.categories);
      },
      (error: HttpErrorResponse) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่', error);
      }
    );
  }

  // ฟังก์ชันแก้ไขหมวดหมู่
  editCategory(category: string) {
    this.newCategoryName = category;
    this.isEditing = true;
    this.categoryToEdit = category;
  }

  // ฟังก์ชันอัปเดตหมวดหมู่
  // category-management.component.ts
updateCategory() {
  if (!this.newCategoryName.trim()) {
    alert('กรุณากรอกชื่อหมวดหมู่');
    return;
  }

  const index = this.categories.indexOf(this.categoryToEdit!);
  if (index > -1) {
    const updatedCategory: Category = { name: this.newCategoryName.trim() };

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    // เรียกใช้งานฟังก์ชัน updateCategory จาก ApiService
    this.apiService.updateCategory(updatedCategory, this.categoryToEdit!).subscribe(
      (response: any) => {
        console.log('หมวดหมู่ถูกอัปเดตแล้ว', response);
        this.categories[index] = this.newCategoryName.trim();
        this.newCategoryName = '';
        this.isEditing = false;
        this.categoryToEdit = null;
      },
      (error: HttpErrorResponse) => {
        console.error('เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่', error);
      }
    );
  }
}


  // ฟังก์ชันสำหรับการกลับไปที่ dashboard
  goBack() {
    this.router.navigate(['/dashboard']);
  }  
}
