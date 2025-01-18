import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item, ItemGroup } from '../items.model';
import { filter, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from '../../not-found-page/not-found-page.component';
import { InventoryService } from '../../inventory/inventory.service';
import { Inventory } from '../../inventory/inventory.model';
import { TransactionTableComponent } from "../../inventory/transaction-table/transaction-table.component";
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs'
import { TagsService } from '../../tags/tags.service';
import { Tag } from '../../tags/tags.model';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-item-page',
  imports: [CommonModule, NotFoundPageComponent, TransactionTableComponent, MatCardModule, MatTabsModule, MatChipsModule, MatFormFieldModule, MatIconModule],
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.css'
})
export class ItemPageComponent {
  public static Route = {
    path: 'items/:name',
    title: 'Item',
    component: ItemPageComponent
  };

  public item: Observable<ItemGroup | null>;
  public itemIsNull: boolean = false;
  public inventory: Observable<Inventory | null> = of(null);
  public tags: Tag[] | null = null;
  public separatorKeysCodes = [ENTER, COMMA];

  constructor(private route: ActivatedRoute, private itemsService: ItemsService, private inventoryService: InventoryService, private tagsService: TagsService) {
    this.item = this.itemsService.getItem(this.route.snapshot.params['name'])

    this.item.subscribe(item => {
      if (item == null) {
        this.itemIsNull = true;
      } else {
        this.inventory = inventoryService.getTransactions(item.name);
        tagsService.getTags(item.name).subscribe(ts => this.tags = ts);
      }
    })
  }

  isGroup(item: ItemGroup) {
    return item.sub_items.length > 0;
  }

  getStatEntries(inventory: Inventory) {
    let entries = Object.entries(inventory.stats).map(([key, value]) => [this.statNameFormat(key), value]);
    return entries;
  }

  statNameFormat(stat: string) {
    return stat.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getItems(item: ItemGroup) {
    if (item.sub_items.length == 0) {
      return [{
        name: item.name,
        price: item.price,
        img_url: item.img_url
      }];
    }
    return item.sub_items;
  }

  deleteTag(tag: Tag) {
    this.tagsService.deleteTag(tag.id);
    this.tags = this.tags ? this.tags.filter(t => t.id != tag.id) : [];
  }

  addTag(item: Item, event: MatChipInputEvent) {
    let tag_name = event.value.trim();
    if (tag_name.length < 1) return;

    this.tagsService.postTag(item.name, tag_name).subscribe(v => {
      this.tags?.push(v);
      event.chipInput.clear();
    });
  }
}
