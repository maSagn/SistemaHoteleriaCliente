import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularHoteleria';

  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLogin(): boolean {
    return this.router.url === '/login';
  }
}
