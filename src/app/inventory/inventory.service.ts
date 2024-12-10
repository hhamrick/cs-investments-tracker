import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Inventory, Transaction } from './inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(protected http: HttpClient) {}

  postTransaction(item_name: string, quantity: number, price: number): Observable<Transaction> {
    return this.http.post<Transaction>('api/inventory/transaction', {
      item_name: item_name,
      quantity: quantity,
      price: price
    });
  }

  getTransactions(item_name?: string): Observable<Inventory | null> {
    if (item_name) {
      return this.http.get<Inventory>(`api/inventory/transactions?item=${item_name}`).pipe(catchError(() => of(null)));
    }
    return this.http.get<Inventory>('api/inventory/transactions').pipe(catchError(() => of(null)));
  }
}
