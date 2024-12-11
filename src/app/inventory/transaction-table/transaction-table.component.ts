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

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule, CurrencyPipe, MatTableModule, MatPaginatorModule, MatIcon, MatIconButton],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css'
})
export class TransactionTableComponent implements OnInit, AfterViewInit {
  transactions = input.required<Transaction[]>();
  showPaginator = computed(() => this.transactions().length > 5);
  dataSource = new MatTableDataSource<Transaction>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private snackBar: MatSnackBar, private inventoryService: InventoryService, private dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.data = this.transactions();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  newTransDialog() {
    this.dialog.open(NewTransactionDialogComponent, { data: { item: this.transactions()[0].item_name }})
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
