// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { AdminGuard } from './admin.guard'; // นำเข้า AdminGuard


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category-management', component: CategoryManagementComponent, canActivate: [AdminGuard] }, // ใช้ guard ในการตรวจสอบสิทธิ์
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'edit-post', component: EditPostComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
