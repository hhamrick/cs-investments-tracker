import { Component, input } from '@angular/core';
import { Transaction } from '../inventory.model';
import { Item } from '../../items/items.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})
export class StatsCardComponent {
  items = input.required<Item[]>();
  inventory = input.required<Transaction[]>();
  c_format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  getStats() {
    let stats = [];

    let prices = new Map();
    for (let item of this.items()) {
      prices.set(item.name, item.price);
    }
    let transactions = this.inventory();

    let total_quantity = transactions.reduce((s, t) => s + t.quantity, 0);
    stats.push(`Held Quantity: ${total_quantity}`);
    
    let total_value = transactions.reduce((s, t) => {
      return s + t.quantity * prices.get(t.item_name);
    }, 0);
    stats.push(`Held Value: ${this.currency(total_value)}`);

    let total_spent = 0;
    let total_sold = 0;
    transactions.forEach(t => {
      if (t.quantity > 0) total_spent += t.quantity * t.price;
      else total_sold += -t.quantity * t.price;
    });
    stats.push(`Total Spent: ${this.currency(total_spent)}`);
    stats.push(`Total Sold: ${this.currency(total_sold)}`);

    let realized_profit = total_sold - total_spent;
    stats.push(`Realized Profit: ${this.currency(realized_profit)}`);

    let total_profit = realized_profit + total_value;
    let profit_percent = total_profit / total_spent * 100;
    stats.push(`Total Profit: ${this.currency(total_profit)} (${this.percent(profit_percent)})`);

    return stats;
  }

  currency(n: number) {
    return this.c_format.format(n);
  }

  percent(n: number) {
    return Math.round(n * 100) / 100 + '%';
  }
}
