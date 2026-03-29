import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LoadingSpinnerComponent, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event: any = null;
  loading = true;
  isLoggedIn = false;
  hasRSVPed = false;
  mapUrl: SafeResourceUrl | null = null;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.userId = payload.user.id;
          } catch (e) {}
        }
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string) {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (data) => {
        this.event = data;
        const address = `${this.event.location.address}, ${this.event.location.city}`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
        );
        this.checkRsvpStatus();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  checkRsvpStatus() {
    if (this.userId && this.event) {
      this.hasRSVPed = this.event.attendees.some((a: any) => a._id === this.userId || a === this.userId);
    }
  }

  get rsvpProgress(): number {
    if (!this.event) return 0;
    return (this.event.attendees.length / this.event.maxAttendees) * 100;
  }

  toggleRsvp() {
    if (!this.isLoggedIn) return;
    
    if (this.hasRSVPed) {
      this.eventService.cancelRsvp(this.event._id).subscribe({
        next: () => {
          this.loadEvent(this.event._id);
        }
      });
    } else {
      this.eventService.rsvp(this.event._id).subscribe({
        next: () => {
          this.loadEvent(this.event._id);
        }
      });
    }
  }
}
