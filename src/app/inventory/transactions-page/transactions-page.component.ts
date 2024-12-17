import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Inventory } from '../inventory.model';
import { InventoryService } from '../inventory.service';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-page',
  imports: [CommonModule, MatCardModule, TransactionTableComponent],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent {
  public static Route = {
    path: 'transactions',
    title: 'Transactions',
    component: TransactionsPageComponent
  }

  public inventory: Observable<Inventory | null> = of(null);

  constructor(private inventoryService: InventoryService) {
    this.inventory = inventoryService.getTransactions();
  }
}
