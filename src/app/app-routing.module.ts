// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category-management', component: CategoryManagementComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' }, // เส้นทางเริ่มต้น
  // { path: '**', redirectTo: '/home' } // เส้นทางสำรองกรณีไม่พบ
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
