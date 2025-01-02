import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-edit-button',
  standalone: true,
  imports: [],
  templateUrl: './call-edit-button.component.html',
  styleUrl: './call-edit-button.component.scss'
})
export class CallEditButtonComponent {
  editActive: boolean = false;

  constructor(private router: Router){}

  goToEditView(): void
  {
    this.router.navigate(['/edit-results']).then(() => {window.location.reload();});
  }
}
