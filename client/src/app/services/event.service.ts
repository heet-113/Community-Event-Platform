import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, eventData);
  }

  updateEvent(id: string, eventData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  rsvp(eventId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/rsvp`, {});
  }

  cancelRsvp(eventId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventId}/rsvp`);
  }
}
