import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, RouterModule
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  categories = ['Music', 'Tech', 'Sports', 'Food', 'Art', 'Networking'];
  error = '';
  eventId = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.eventService.getEvent(this.eventId).subscribe(event => {
        const d = new Date(event.date);
        const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        this.eventForm.patchValue({
          ...event,
          date: dateStr
        });
      });
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
        next: (res) => this.router.navigate(['/events', res._id]),
        error: (err) => this.error = err.error?.msg || 'Failed to update event'
      });
    }
  }
}
