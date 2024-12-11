import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../inventory.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-new-transaction-dialog',
  imports: [MatDialogModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './new-transaction-dialog.component.html',
  styleUrl: './new-transaction-dialog.component.css'
})
export class NewTransactionDialogComponent {
  quantity = 0;
  price = 0;
  data = inject(MAT_DIALOG_DATA);

  constructor(private inventoryService: InventoryService) {}

  create() {
    this.inventoryService.postTransaction(this.data.item, Math.round(this.quantity), Math.round(this.price * 100) / 100).subscribe();
    window.location.reload();
  }
}
