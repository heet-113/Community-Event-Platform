import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  categories = ['Music', 'Tech', 'Sports', 'Food', 'Art', 'Networking'];
  error = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      location: this.fb.group({
        city: ['', Validators.required],
        address: ['', Validators.required]
      }),
      bannerImage: [''],
      maxAttendees: [100, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: (res) => this.router.navigate(['/events', res._id]),
        error: (err) => this.error = err.error?.msg || 'Failed to create event'
      });
    }
  }
}
