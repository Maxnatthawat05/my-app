import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Category } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = []; // List of existing categories
  newCategoryName: string = ''; // New category name
  categoryToEdit: Category | null = null; // Category being edited
  isEditing: boolean = false; // Toggle for showing edit form

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
  }

  // Add new category
  addNewCategory() {
    const newCategory: Category = { id: '', name: this.newCategoryName };
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('Please log in first');
      return;
    }

    this.apiService.addCategory(newCategory).subscribe(
      (response: any) => {
        console.log('Category added:', response);
        this.getCategories();
        this.newCategoryName = ''; // Clear input after adding
      },
      (error: HttpErrorResponse) => {
        console.error('Error adding category:', error);
      }
    );
  }

  // Remove category
  removeCategory(categoryName: string) {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('Please log in first');
      return;
    }

    this.apiService.deleteCategory(categoryName).subscribe(
      (response: any) => {
        console.log('Category deleted:', response);
        this.getCategories();
      },
      (error: HttpErrorResponse) => {
        console.error('Error deleting category:', error);
      }
    );
  }

  // Fetch all categories
  getCategories() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      alert('Please log in first');
      return;
    }

    this.apiService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        console.log('All categories:', this.categories);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Edit category
  editCategory(category: Category) {
    this.newCategoryName = category.name;
    this.isEditing = true;
    this.categoryToEdit = category;
  }

  // Update category
  updateCategory() {
    if (!this.newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const updatedCategory: Category = {
      id: this.categoryToEdit?.id || '',
      name: this.newCategoryName.trim()
    };

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in first');
      return;
    }

    this.apiService.updateCategory(updatedCategory, updatedCategory.id).subscribe(
      (response: any) => {
        console.log('Category updated:', response);
        this.getCategories(); // Refresh categories list
        this.newCategoryName = '';
        this.isEditing = false;
        this.categoryToEdit = null;
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating category:', error);
      }
    );
  }

  // Navigate back to the dashboard
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
