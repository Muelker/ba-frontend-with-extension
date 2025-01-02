import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { InformationExchangeService } from './services/information-exchange.service';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription;

  constructor(private router: Router,private authService: AuthService, private informationExchangeService: InformationExchangeService) {
  }

  ngOnInit() {

    this.refreshSubscription = interval(60000) // every 60 seconds
      .pipe(
        startWith(0), // start immediately
        switchMap(() => this.authService.refreshToken())
      )
      .subscribe(
        response => {
          sessionStorage.setItem('accessToken', response.access);
        },
        error => {
          this.informationExchangeService.removeAllEntries();
          console.error(error + " (AppComponent)");
          this.router.navigate(['/login']);
        }
      );
      
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
