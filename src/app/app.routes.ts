import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { EditResultsComponent } from './components/edit-results/edit-results.component';
import { authGuard } from './authguard'

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'edit-results', component: EditResultsComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: MainViewComponent, canActivate: [authGuard] },
];
