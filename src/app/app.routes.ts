import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ItemsPageComponent } from './items/items-page/items-page.component';
import { ItemPageComponent } from './items/item-page/item-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { TransactionsPageComponent } from './inventory/transactions-page/transactions-page.component';
import { InventoryPageComponent } from './inventory/inventory-page/inventory-page.component';

export const routes: Routes = [
    // not found must be last
    HomePageComponent.Route,
    ItemsPageComponent.Route,
    ItemPageComponent.Route,
    TransactionsPageComponent.Route,
    InventoryPageComponent.Route,
    NotFoundPageComponent.Route
];
