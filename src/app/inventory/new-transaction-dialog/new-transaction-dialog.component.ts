import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../inventory.service';
import { MatSelectModule } from '@angular/material/select';
import { Item } from '../../items/items.model';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-new-transaction-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatButtonToggleModule],
  templateUrl: './new-transaction-dialog.component.html',
  styleUrl: './new-transaction-dialog.component.css'
})
export class NewTransactionDialogComponent {
  quantity = 1;
  price;
  selectedItem = '';
  buysell = 'buy';

  data = inject(MAT_DIALOG_DATA);
  items: Item[];

  constructor(private inventoryService: InventoryService) {
    this.items = this.data.items;
    this.price = this.items.length > 0 ? this.items[0].price : 0;
  }

  create() {
    if (this.quantity == 0 || this.price == 0) {
      return;
    }

    if (this.items.length > 0) {
      if (this.items.length == 1) {
        this.inventoryService.postTransaction(this.items[0].name, Math.round(this.quantity) * this.quantityMult(), Math.round(this.price * 100) / 100).subscribe();
      } else {
        if (this.selectedItem == '') {
          return;
        }
        this.inventoryService.postTransaction(this.selectedItem, Math.round(this.quantity) * this.quantityMult(), Math.round(this.price * 100) / 100).subscribe();
      }
    }
    window.location.reload();
  }

  quantityMult() {
    return this.buysell == 'buy' ? 1 : -1;
  }
}
