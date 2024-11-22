import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {
  public static Route = {
    path: '**',
    title: 'Not Found',
    component: NotFoundPageComponent
  }
}
