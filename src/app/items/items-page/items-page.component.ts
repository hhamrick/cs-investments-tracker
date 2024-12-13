import { Component } from '@angular/core';
import { ItemsService } from '../items.service';
import { ItemOverview } from '../items.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-items-page',
  imports: [CommonModule, RouterLink, MatCardModule],
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.css'
})
export class ItemsPageComponent {
  public static Route = {
    path: 'search/:keywords',
    title: 'Items',
    component: ItemsPageComponent
  }

  public items: Observable<ItemOverview[]> = of([]);

  constructor(private route: ActivatedRoute, protected itemsService: ItemsService) {
    this.route.params.subscribe(params => {
      this.items = this.itemsService.searchItems(params['keywords']);
    })
  }
}
