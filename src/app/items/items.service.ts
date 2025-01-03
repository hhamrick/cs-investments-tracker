import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ItemGroup, ItemOverview } from './items.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(protected http: HttpClient) {}

  getItem(name: string): Observable<ItemGroup | null> {
    return this.http.get<ItemGroup>(`/api/items/${name}`).pipe(catchError(() => of(null)));
  }

  searchItems(keywords: string): Observable<ItemOverview[]> {
    return this.http.get<ItemOverview[]>(`/api/items/search/${keywords}`);
  }
}
