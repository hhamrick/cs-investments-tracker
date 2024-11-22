import { Component } from '@angular/core';
import { ItemsService } from '../items.service';
import { Item } from '../items.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items-page',
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.css'
})
export class ItemsPageComponent {
  public static Route = {
    path: 'items',
    title: 'Items',
    component: ItemsPageComponent
  }

  public items: Observable<Item[]> = of([]);
  public searchTxt = "";

  constructor(protected itemsService: ItemsService) {}

  onSearchClick(): void {
    this.items = this.itemsService.searchItems(this.searchTxt);
  }
}
