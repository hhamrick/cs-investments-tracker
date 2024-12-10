import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item } from '../items.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from '../../not-found-page/not-found-page.component';
import { InventoryService } from '../../inventory/inventory.service';
import { Inventory } from '../../inventory/inventory.model';
import { TransactionCardComponent } from "../../inventory/transaction-card/transaction-card.component";

@Component({
  selector: 'app-item-page',
  imports: [CommonModule, NotFoundPageComponent, TransactionCardComponent],
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.css'
})
export class ItemPageComponent {
  public static Route = {
    path: 'items/:name',
    title: 'Item',
    component: ItemPageComponent
  }

  public item: Observable<Item | null>;
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
}
