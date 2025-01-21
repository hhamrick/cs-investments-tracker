import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { InventoryItem, InvForStats, Transaction } from './inventory.model';

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

  deleteTransaction(id: number) {
    this.http.delete<null>(`api/inventory/transaction/${id}`).subscribe();
  }

  getTransactions(item_name?: string): Observable<Transaction[] | null> {
    if (item_name) {
      return this.http.get<Transaction[]>(`api/inventory/transactions?item=${item_name}`).pipe(catchError(() => of(null)));
    }
    return this.http.get<Transaction[]>('api/inventory/transactions').pipe(catchError(() => of(null)));
  }

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>('api/inventory').pipe(catchError(() => of([])));
  }

  getInvForStats(): Observable<InvForStats | null> {
    return this.http.get<InvForStats>('api/inventory/forstats').pipe(catchError(() => of(null)));
  }
}
