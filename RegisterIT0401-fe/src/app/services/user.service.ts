import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileBase64: string;
  birthDay: string; // ISO format
  occupation: string;
  sex: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5134/api/users'; // URL of backend

  saveUser(user: User): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(this.apiUrl, user);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${encodeURIComponent(email)}`);
  }
}
