import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item } from '../items.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from '../../not-found-page/not-found-page.component';

@Component({
  selector: 'app-item-page',
  imports: [CommonModule, NotFoundPageComponent],
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

  constructor(private route: ActivatedRoute, private router: Router, private itemsService: ItemsService) {
    this.item = this.itemsService.getItem(this.route.snapshot.params['name'])

    this.item.subscribe(item => {
      if (item == null) {
        this.itemIsNull = true;
      }
    })
  }
}
