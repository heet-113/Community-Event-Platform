import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState.asObservable();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.authState.next(true);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.authState.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }
}
