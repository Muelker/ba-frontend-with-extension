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


@Component({
  selector: 'app-change-overlays',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatSelectModule, MatTooltipModule, FormsModule, CommonModule],
  templateUrl: './change-overlays.component.html',
  styleUrl: './change-overlays.component.scss'
})
export class ChangeOverlaysComponent {
  overlay = {newText: '', notes:''};


  constructor(private projectService: ProjectService, public dialogRef: MatDialogRef<ChangeOverlaysComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  this.overlay.newText = this.data.overlay.text;
  }

  onSubmit(): void {
    //Daten an den BackendServer senden
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
