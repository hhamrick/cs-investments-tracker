import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(protected http: HttpClient, protected router: Router) { }

  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>('/auth/user').pipe(catchError(() => of(null)))
  }

  login() {
    window.location.href = '/auth/login';
  }

  logout() {
    return this.http.delete('/auth/logout');
  }
}
