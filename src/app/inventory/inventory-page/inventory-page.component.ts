import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { map, Observable, of } from 'rxjs';
import { InventoryItem } from '../inventory.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent implements AfterViewInit {
  public static Route = {
    path: 'inventory',
    title: 'Inventory',
    component: InventoryPageComponent
  }

  inventory: Observable<InventoryItem[]> = of([]);
  displayed_col = ['image', 'name', 'price', 'quantity', 'total'];
  showPaginator = this.inventory.pipe(map(v => v.length > 5 || true));
  
  dataSource = new MatTableDataSource<InventoryItem>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventoryService: InventoryService) {
    this.inventory = inventoryService.getInventory();
    this.inventory.subscribe(v => this.dataSource.data = v);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
