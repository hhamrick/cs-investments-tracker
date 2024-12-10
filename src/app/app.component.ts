import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { UserService } from './user/user.service';
import { User } from './user/user.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbar, MatButton, MatMenuModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cs-investments-tracker';
  user: Observable<User | null>;
  public searchTxt = "";

  constructor(protected router: Router, protected userService: UserService) {
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

  search() {
    this.router.navigate(['search', this.searchTxt]);
  }
}
