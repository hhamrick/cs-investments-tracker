import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Item } from './items.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(protected http: HttpClient) {}

  getItem(name: string): Observable<Item | null> {
    return this.http.get<Item>(`/api/items/${name}`).pipe(catchError(() => of(null)));
  }

  searchItems(keywords: string): Observable<Item[]> {
    return this.http.get<Item[]>(`/api/items/search/${keywords}`);
  }
}
