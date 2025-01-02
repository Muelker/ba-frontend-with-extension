import { Component, EventEmitter, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from '../../interfaces/project';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { InformationExchangeService } from '../../services/information-exchange.service';
import { SelectedProjectService} from '../../services/selected-project.service';

import {MatIconModule} from '@angular/material/icon'; 
import {MatCardModule} from '@angular/material/card'; 
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatInputModule} from '@angular/material/input'; 

import { CreateProjectComponent } from '../create-project/create-project.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatListModule, CreateProjectComponent, MatIconModule, MatProgressSpinnerModule, MatInputModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit, OnDestroy{

  private selectedProjectSubscription = new Subscription();

  
  constructor(public dialog: MatDialog, private projectService: ProjectService, private informationExchangeService: InformationExchangeService, private selectedProjectService: SelectedProjectService) {
  }

  value: string = "";
  displayProjects: Project[] = []; 
  allProjects: Project[] = []; 
  selectedProject?: Project;
  projectBeingVisualized?: Project;


  selectProject(project: Project): void {
    this.selectedProjectService.setSelectedProject(project, true);
  }

  ngOnInit(): void {
    this.selectedProjectSubscription = this.selectedProjectService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
    });
    this.projectService.getProjectsObservable().subscribe(projects => {
      this.displayProjects = projects;
      this.allProjects = projects;
      this.setSelcetedProjectNew();
    });

    this.loadProjects();
  }

  ngOnDestroy() {
    this.selectedProjectSubscription.unsubscribe();
  }

  setSelcetedProjectNew() {
    for(let i = 0; i < this.allProjects.length; i++) {
      if(this.selectedProject) {
        if (this.selectedProject.id == this.allProjects[i].id){
          this.selectedProjectService.setSelectedProject(this.allProjects[i], true);
          return;
        }
      }
    }
    if (this.selectedProject) {
      this.selectedProjectService.setSelectedProject(this.selectedProject, false);
    }
  }

  isSelected(project: Project): boolean {
    if (this.selectedProject)
      return this.selectedProject && this.selectedProject.id === project.id;
    return false;
  }

  isVisualized(project: Project): boolean {
    if ((this.informationExchangeService.getEntry(project.id) !== undefined) && this.informationExchangeService.getEntry(project.id))
      return true;
    return false;
  }

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      width: '300px',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {
    this.projectService.getProjects().pipe(
      tap(response => {
        this.displayProjects = response;
        this.allProjects = response;
      }),
      catchError(error => {
        console.error("Could not get projects", error);
        return of(null);
      })
    ).subscribe();
    
    console.log('Der Dialog wurde geschlossen');
    });
  }

  loadProjects() {
    this.projectService.loadProjects().subscribe();
  }

  openDialog(project: Project, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      width: '250px',
    });

    dialogRef.componentInstance.deleteClickedNo.subscribe(() => {
    });

    dialogRef.componentInstance.deleteClickedYes.subscribe(() => {
      this.deleteProject(project);
    });
  }

  deleteProject(project: Project): void {
    this.projectService.deleteProject(project.id).subscribe(
      response => {
        this.informationExchangeService.removeEntry(project.id);

        this.projectService.getProjects().pipe(
          tap(response => {
            this.displayProjects = response;
            this.allProjects = response;

          }),
          catchError(error => {
            console.error("Could not get projects", error);
            return of(null);
          })
        ).subscribe();
      },
      error => console.error(error + "delete project")
    );
    if (this.selectedProject == project){
      this.selectedProjectService.setSelectedProject(project, false);
    }
  }

  searchProjects(text: string) {
    let foundProjects: Project[] = [];
    
    for(let i=0; i<this.allProjects.length; i++){
      if (this.allProjects[i].description.toLocaleLowerCase().includes(text.toLocaleLowerCase()) || this.allProjects[i].name.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
        foundProjects.push(this.allProjects[i]);
      }
    }

    this.displayProjects = foundProjects;
  }

  searchProjectsCancle() {
    this.value = "";
    this.displayProjects = this.allProjects;
  }
}
