import { AfterViewInit, Component, computed, input, OnInit, ViewChild } from '@angular/core';
import { Transaction } from '../inventory.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { InventoryService } from '../inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from '../new-transaction-dialog/new-transaction-dialog.component';
import { Item } from '../../items/items.model';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule, CurrencyPipe, MatTableModule, MatPaginatorModule, MatIcon, MatIconButton, MatCardModule, MatSortModule],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css'
})
export class TransactionTableComponent implements OnInit, AfterViewInit {
  transactions = input.required<Transaction[]>();
  items = input<Item[]>([]);
  show_name = input<boolean>();
  no_buttons = input<boolean>();

  displayed_col = ['buysell', 'price', 'quantity', 'total', 'actions'];
  showPaginator = computed(() => this.transactions().length > 5);
  dataSource = new MatTableDataSource<Transaction>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private snackBar: MatSnackBar, private inventoryService: InventoryService, private dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.data = this.transactions();
    if (this.no_buttons()) {
      this.displayed_col.pop();
    }
    if (this.show_name() || this.items().length > 1) {
      this.displayed_col.splice(1, 0, 'name');
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  newTransDialog() {
    this.dialog.open(NewTransactionDialogComponent, { data: {items: this.items() }})
  }

  delete(transaction: Transaction) {
    let confirmDelete = this.snackBar.open(
      'Are you sure you want to delete this transaction?',
      'DELETE',
      { duration: 10000 }
    )

    confirmDelete.onAction().subscribe(() => {
      this.inventoryService.deleteTransaction(transaction.id);
      window.location.reload();
    })
  }
}
