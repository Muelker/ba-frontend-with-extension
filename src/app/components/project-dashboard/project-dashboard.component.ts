import { Component, Inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project';
import { SelectedProjectService } from '../../services/selected-project.service';
import { AiModel } from '../../interfaces/ai_model';
import { InformationExchangeService } from '../../services/information-exchange.service';

import { FormsModule } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip'; 

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatSelectModule, MatTooltipModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent {
  projects: Project[] = [];

  constructor(private informationExchangeService: InformationExchangeService, private selectedProjectService: SelectedProjectService, private projectService: ProjectService, public dialogRef: MatDialogRef<ProjectDashboardComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.projectService.getProjects().pipe(
      tap(response => {
        this.projects = response;
      }),
      catchError(error => {
        console.error("Could not get projects", error);
        return of(null);
      })
    ).subscribe();
  }

  onClose(): void {

    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  isProjectVisualized(project: Project) {
    if(project.images.length == 0) {
      return false;
    }
    let isVisualized = true;

    for (let i = 0; i < project.images.length; i++) {
      if (project.images[i].has_result == false) {
        isVisualized = false;
      }
    }
    return isVisualized;
  }

  isProjectPartlyVisualized(project: Project) {

    if(this.isProjectVisualized(project) || (project.images.length == 0)) {
      return false;
    }
    for (let i = 0; i < project.images.length; i++) {
      if (project.images[i].has_result == true) {
        return true;
      }
    }
    return false;
  }

  goToProject(project: Project){
    this.selectedProjectService.setSelectedProject(project, true);
    this.informationExchangeService.changeTab(0);
    this.closeDialog();
  }
}
