import { Component } from '@angular/core';
import { ItemsService } from '../items.service';
import { Item } from '../items.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-items-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.css'
})
export class ItemsPageComponent {
  public static Route = {
    path: 'search/:keywords',
    title: 'Items',
    component: ItemsPageComponent
  }

  public items: Observable<Item[]> = of([]);

  constructor(private route: ActivatedRoute, protected itemsService: ItemsService) {
    this.route.params.subscribe(params => {
      this.items = this.itemsService.searchItems(params['keywords']);
    })
  }
}
