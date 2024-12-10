import { Component, input } from '@angular/core';
import { Transaction } from '../inventory.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-transaction-card',
  imports: [CommonModule, CurrencyPipe, MatCardModule],
  templateUrl: './transaction-card.component.html',
  styleUrl: './transaction-card.component.css'
})
export class TransactionCardComponent {
  transaction = input.required<Transaction>();
  $transaction = toObservable(this.transaction);
}
