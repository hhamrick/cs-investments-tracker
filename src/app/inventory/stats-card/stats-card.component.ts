import { Component, input } from '@angular/core';
import { Inventory } from '../inventory.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})
export class StatsCardComponent {
  inventory = input.required<Inventory>();

  getStatEntries() {
    let entries = Object.entries(this.inventory().stats).map(([key, value]) => [this.statNameFormat(key), value]);
    return entries;
  }

  statNameFormat(stat: string) {
    return stat.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
