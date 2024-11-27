import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { UserService } from './user/user.service';
import { User } from './user/user.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbar, MatButton, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cs-investments-tracker';
  user: Observable<User | null>;

  constructor(protected userService: UserService) {
    this.user = userService.getCurrentUser();
  }

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.user = of(null);
    });
  }
}
