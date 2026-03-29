import { Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-event', component: CreateEventComponent, canActivate: [authGuard] },
  { path: 'edit-event/:id', component: EditEventComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
