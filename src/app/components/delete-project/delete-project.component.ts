import {Component, Output, EventEmitter} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-delete-project',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './delete-project.component.html',
  styleUrl: './delete-project.component.scss'
})
export class DeleteProjectComponent {

  @Output() deleteClickedYes = new EventEmitter<void>();
  @Output() deleteClickedNo = new EventEmitter<void>();


  constructor(public dialogRef: MatDialogRef<DeleteProjectComponent>) {}

  closeDialogNo(): void {
    this.deleteClickedNo.emit();
    this.dialogRef.close();
  }
  closeDialogYes(): void {
    this.deleteClickedYes.emit();
    this.dialogRef.close();
  }
}
