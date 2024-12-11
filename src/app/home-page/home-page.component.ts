import { Component } from '@angular/core';
import { InventoryService } from '../inventory/inventory.service';
import { Observable } from 'rxjs';
import { Inventory } from '../inventory/inventory.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, MatCardModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public static Route = {
    path: '',
    title: 'Home',
    component: HomePageComponent
  }

  inventory: Observable<Inventory  | null>;

  constructor(private inventoryService: InventoryService) {
    this.inventory = inventoryService.getTransactions();
  }
}
