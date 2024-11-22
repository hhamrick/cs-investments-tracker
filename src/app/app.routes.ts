import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ItemsPageComponent } from './items/items-page/items-page.component';
import { ItemPageComponent } from './items/item-page/item-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
    HomePageComponent.Route,
    ItemsPageComponent.Route,
    ItemPageComponent.Route,
    NotFoundPageComponent.Route
];
