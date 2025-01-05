import { Component } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Observable, of } from 'rxjs';
import { InventoryItem } from '../inventory.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, RouterLink, MatTableModule, MatCardModule],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {
  public static Route = {
    path: 'inventory',
    title: 'Inventory',
    component: InventoryPageComponent
  }

  inventory: Observable<InventoryItem[]> = of([]);
  displayed_col = ['image', 'name', 'price', 'quantity', 'total'];
  
  dataSource = new MatTableDataSource<InventoryItem>();

  constructor(private inventoryService: InventoryService) {
    this.inventory = inventoryService.getInventory();
    this.inventory.subscribe(v => this.dataSource.data = v);
  }
}
