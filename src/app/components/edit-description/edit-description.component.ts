import { Component, Inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

import { AiModel } from '../../interfaces/ai_model';

import { FormsModule } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip'; 

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

@Component({
  selector: 'app-edit-description',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatSelectModule, MatTooltipModule, FormsModule, CommonModule],
  templateUrl: './edit-description.component.html',
  styleUrl: './edit-description.component.scss'
})
export class EditDescriptionComponent {
  edit = { description: ''};


  constructor(private projectService: ProjectService, public dialogRef: MatDialogRef<EditDescriptionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.edit.description = this.data.project.description;
  }

  onSubmit(): void {
    this.projectService.editProject(this.data.project.id, this.edit).pipe(
      tap(response => {
        console.log('edited');
      }),
      catchError(error => {
        console.error("Could not change Description", error);
        return of(null);
      })
    ).subscribe();

    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}