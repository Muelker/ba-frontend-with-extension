import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import {MatIconModule} from '@angular/material/icon'; 
import { MatDialog } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { ProjectDashboardComponent } from '../project-dashboard/project-dashboard.component';

4

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatGridListModule, MatToolbarModule, MatIconModule, ProjectDashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() isMenuOpen = new EventEmitter<boolean>();

  isMenuOpenValue: boolean = true;

  constructor(public dialog: MatDialog, private router: Router) {}

  toggleMenu() {
    this.isMenuOpenValue = !this.isMenuOpenValue;
    this.isMenuOpen.emit(this.isMenuOpenValue);
  }

  openDashboard() {
    const dialogRef = this.dialog.open(ProjectDashboardComponent, {
      width: '600px',
      data: {
      }
    }); 
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
