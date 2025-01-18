import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from './tags.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(protected http: HttpClient) { }

  postTag(item_name: string, tag_name: string): Observable<Tag> {
    return this.http.post<Tag>('api/tags', {
      item_name: item_name,
      tag_name: tag_name
    });
  }

  deleteTag(id: number) {
    this.http.delete(`api/tags/${id}`).subscribe();
  }

  getTags(item_name: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`api/tags/${item_name}`).pipe(catchError(() => of([])));
  }
}
