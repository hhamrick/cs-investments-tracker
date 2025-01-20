import { Component } from '@angular/core';
import { InventoryService } from '../inventory/inventory.service';
import { Observable } from 'rxjs';
import { Inventory } from '../inventory/inventory.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../user/user.service';
import { MatButtonModule } from '@angular/material/button';
import { StatsCardComponent } from '../inventory/stats-card/stats-card.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, StatsCardComponent],
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
  invIsNull: boolean = false;

  constructor(private inventoryService: InventoryService, private userService: UserService) {
    this.inventory = inventoryService.getTransactions();
    this.inventory.subscribe((inv) => {
      if (inv == null) this.invIsNull = true;
    });
  }

  login() {
    this.userService.login();
  }
}
