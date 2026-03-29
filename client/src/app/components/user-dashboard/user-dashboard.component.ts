import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatTabsModule, 
    MatIconModule,
    LoadingSpinnerComponent,
    EventCardComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  user: any = null;
  createdEvents: any[] = [];
  rsvpEvents: any[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.createdEvents = data.createdEvents;
        this.rsvpEvents = data.rsvpEvents;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadDashboard();
        }
      });
    }
  }
}
