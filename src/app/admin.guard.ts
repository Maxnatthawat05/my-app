// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }  
}
