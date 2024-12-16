import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item, ItemGroup } from '../items.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from '../../not-found-page/not-found-page.component';
import { InventoryService } from '../../inventory/inventory.service';
import { Inventory } from '../../inventory/inventory.model';
import { TransactionTableComponent } from "../../inventory/transaction-table/transaction-table.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-item-page',
  imports: [CommonModule, NotFoundPageComponent, TransactionTableComponent, MatCardModule],
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.css'
})
export class ItemPageComponent {
  public static Route = {
    path: 'items/:name',
    title: 'Item',
    component: ItemPageComponent
  }

  public item: Observable<Item | ItemGroup | null>;
  public itemIsNull: boolean = false;
  public inventory: Observable<Inventory | null> = of(null);

  constructor(private route: ActivatedRoute, private itemsService: ItemsService, private inventoryService: InventoryService) {
    this.item = this.itemsService.getItem(this.route.snapshot.params['name'])

    this.item.subscribe(item => {
      if (item == null) {
        this.itemIsNull = true;
      } else {
        this.inventory = inventoryService.getTransactions(item.name);
      }
    })
  }

  toGroup(item: Item | ItemGroup) {
    if ('sub_items' in item) {
      return item as ItemGroup;
    }
    return null;
  }

  toItem(item: Item | ItemGroup) {
    if ('sub_items' in item) {
      return null
    }
    return item as Item;
  }

  getHeldValue(inventory: Inventory, item: Item) {
    // return inventory.stats.total_quantity * item.price;
    return 0;
  }

  getProfit(inventory: Inventory, item: Item) {
    return this.getHeldValue(inventory, item) - inventory.stats.total_sold - inventory.stats.total_spent;
  }

  getProfitPercent(inventory: Inventory, item: Item) {
    return this.getProfit(inventory, item) / inventory.stats.total_spent;
  }
}
