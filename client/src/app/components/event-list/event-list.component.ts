import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule, 
    EventCardComponent, 
    LoadingSpinnerComponent,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  loading = true;

  searchQuery = '';
  selectedCategory = '';
  categories = ['Music', 'Tech', 'Sports', 'Food', 'Art', 'Networking'];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            event.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory ? event.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
}
