import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ContributorsListComponent } from './pages/contributors-list/contributors-list.component';
import { AdminManageComponent } from './pages/admin-manage/admin-manage.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'contributors', component: ContributorsListComponent, canActivate: [authGuard] },
  {
    path: 'admin/manage',
    component: AdminManageComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/reports',
    component: AdminReportsComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '', redirectTo: 'contributors', pathMatch: 'full' },
  { path: '**', redirectTo: 'contributors' }
];
