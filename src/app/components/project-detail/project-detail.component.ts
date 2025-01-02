import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project';
import { Image } from '../../interfaces/image';
import { ProjectService } from '../../services/project.service';
import { ResultsService } from '../../services/results.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiModel } from '../../interfaces/ai_model';
import { DeleteMessageComponent } from '../delete-image/delete-image.component';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SecurePipe } from '../../pipes/secure.pipe';
import {MatListModule} from '@angular/material/list';


import { MatGridListModule } from '@angular/material/grid-list';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

import { interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { InformationExchangeService } from '../../services/information-exchange.service';
import { SelectedProjectService } from '../../services/selected-project.service';
import { EditDescriptionComponent } from '../edit-description/edit-description.component';
import { EditNameComponent } from '../edit-name/edit-name.component';
import { AiChainModule } from '../../interfaces/ai_chain_module';
import { ChainConfigComponent } from '../chain-config/chain-config.component';


@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule,FormsModule, SecurePipe, MatGridListModule, ReactiveFormsModule, ChainConfigComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  selectedProject?: Project;
  private selectedProjectSubscription = new Subscription();

  constructor(private projectService: ProjectService,
    private resultService: ResultsService,
    public dialog: MatDialog,
    private informationExchangeService: InformationExchangeService,
    private selectedProjectService: SelectedProjectService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  //imageForm = this.formBuilder.group({image: '', submit_image: ''});

  images: Image[] = [];
  aiModelName: string = "";
  aiModels: AiModel[] = [];
  aiChainModules: AiChainModule[] = [];
  selectedAiChainModules: AiChainModule[] = [];

  /* form: FormGroup = this.formBuilder.group({
    //........
    images: [null]
  }); */

  ngOnDestroy() {
    this.selectedProjectSubscription.unsubscribe();
  }
  ngOnInit() {
    this.selectedProjectSubscription = this.selectedProjectService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
      this.images = [];
      this.loadImages();
      this.selectedAiChainModules = [];
      for (let i = 0; i < this.aiModels.length; i++) {
        if (this.selectedProject?.ai_model_id == this.aiModels[i].id) {
          this.aiModelName = this.aiModels[i].name;
        }
      }
      this.getAiChainModules();
      console.log(this.aiChainModules);
    });
    //Get AIModels on init
    //this.getAIModels();
    
  }

  selectedFiles: File[] = [];

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      /* const reader = new FileReader();
      reader.readAsDataURL(this.selectedFiles[this.selectedFiles.length-1]); */
    }
  }

  isProjectVisualized(project: Project) {
    if (this.images.length == 0) {
      return false;
    }
    let isVisualized = true;

    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].has_result == false) {
        isVisualized = false;
      }
    }
    return isVisualized;
  }

  isProjectPartlyVisualized(project: Project) {

    if (this.isProjectVisualized(project) || (this.images.length == 0)) {
      return false;
    }
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].has_result == true) {
        return true;
      }
    }
    return false;
  }

  loadImages(): void {
    if (this.selectedProject?.id !== undefined) {
      this.projectService.getImages(this.selectedProject.id).pipe(
        tap(data => {
          console.log("Bilder erfolgreich geladen: ", data);
        }),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      ).subscribe(
        data => this.images = data
      );
    }
  }

  uploadImage(): void {
    //console.log(this.selectedFiles);
      this.selectedFiles.forEach(file => {
        //console.log(file);
        const formData = new FormData();
        formData.append('images', file, file.name);
        
        if (this.selectedProject?.id !== undefined) {
          this.projectService.uploadImage(this.selectedProject.id, formData).pipe(
            tap(response => {
              this.informationExchangeService.executeFunction.emit();
              console.log('Image uploaded successfully!');
              this.loadImages();
            }),
            catchError(error => {
              this.snackBar.open('Bilder konnten nicht hochgeladen werden!', 'Schließen', {
                duration: 3000
              });
              console.error(error);
              return of(null);
            })
          ).subscribe();
        } else {
          console.error('Selected project is undefined (uploadImage)');
        }
      });
  }

  deleteImg(image: Image): void {
    if (this.selectedProject) {

      this.projectService.deleteImg(image.project_id, image.id).pipe(
        tap(respons => {
          this.informationExchangeService.executeFunction.emit();
          this.loadImages();
        }),
        catchError(error => {
          this.snackBar.open('Bilde konnte nicht gelöscht werden!', 'Schließen', {
            duration: 3000
          });
          console.error(error);
          return of(null);
        })
      ).subscribe();
    }
  }

  openDialog(image: Image): void {
    const dialogRef = this.dialog.open(DeleteMessageComponent, {
      width: '250px',
    });

    dialogRef.componentInstance.deleteClickedNo.subscribe(() => {
    });

    dialogRef.componentInstance.deleteClickedYes.subscribe(() => {
      this.deleteImg(image);
    });
  }

  startVisualization() {
    if (this.selectedProject) {
      const currentProjectId = this.selectedProject.id;
      if (this.images.length == 0) return;

      let selectedAiChainModulesIdList = [];
      for(let module of this.selectedAiChainModules) {
        selectedAiChainModulesIdList.push(module.id)
      }

      console.log(selectedAiChainModulesIdList);

      this.resultService.startVisualization(currentProjectId, selectedAiChainModulesIdList).pipe(
        tap(response => {
          this.informationExchangeService.addEntry(currentProjectId, true);
          const pollingInterval = 1000;
          interval(pollingInterval).pipe(
            switchMap(() => this.projectService.getProject(currentProjectId)),
            takeWhile(project => this.checkCondition(project), true)
          ).subscribe(project => {
            if (!this.checkCondition(project)) {
              this.informationExchangeService.removeEntry(currentProjectId);
              this.informationExchangeService.executeFunction.emit();
              console.log('Visualization Completed');
              this.projectService.loadProjects().subscribe();
            }
            else {
              console.error("Visualisation not complete");
            }
          });
        }),
        catchError(error => {
          this.informationExchangeService.removeEntry(currentProjectId);
          this.snackBar.open('Visualisierung konnte nicht gestartet werden!', 'Schließen', {
            duration: 3000
          });
          console.error("Could not start visualization", error);
          return of(null);
        })
      ).subscribe();
    }
  }

  startVisualizationRest() {
    if (this.selectedProject) {
      const currentProjectId = this.selectedProject.id;
      if (this.images.length == 0) return;

      let selectedAiChainModulesIdList = [];
      for(let module of this.selectedAiChainModules) {
        selectedAiChainModulesIdList.push(module.id)
      }

      this.resultService.startVisualizationRest(currentProjectId, selectedAiChainModulesIdList).pipe(
        tap(response => {
          this.informationExchangeService.addEntry(currentProjectId, true);
          const pollingInterval = 1000;
          interval(pollingInterval).pipe(
            switchMap(() => this.projectService.getProject(currentProjectId)),
            takeWhile(project => this.checkCondition(project), true)
          ).subscribe(project => {
            if (!this.checkCondition(project)) {
              this.informationExchangeService.removeEntry(currentProjectId);
              this.informationExchangeService.executeFunction.emit();
              console.log('Visualization Completed');
              this.projectService.loadProjects().subscribe();
            }
            else {
              console.error("Visualisation not complete");
            }
          });
        }),
        catchError(error => {
          this.informationExchangeService.removeEntry(currentProjectId);
          this.snackBar.open('Visualisierung konnte nicht gestartet werden!', 'Schließen', {
            duration: 3000
          });
          console.error("Could not start visualization", error);
          return of(null);
        })
      ).subscribe();
    }
  }

  getAIModels() {
    this.projectService.getAIModels().pipe(
      tap(response => {
        this.aiModels = response;
      }),
      catchError(error => {
        console.error("Could not get AIModels", error);
        return of(null);
      })
    ).subscribe();
  }

  getAiChainModules() {
    if(this.selectedProject){
      console.log("Getting Modules");
      this.projectService.getAIChainModules(this.selectedProject.id).pipe(
        tap(response => {
          this.aiChainModules = response;
        }),
        catchError(error => {
          console.error("Could not get aiChainModules", error);
          return of(null);
        })
      ).subscribe();
    }
  }

  setAiSelected(data: AiChainModule[]) {
    this.selectedAiChainModules = data;
    console.log("selected:", this.selectedAiChainModules);
  }

  checkCondition(project: Project): boolean {
    if (project.status == 'COMPLETED') {
      return false;
    }
    return true;
  }

  editDescription(project: Project) {
    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      width: '300px',
      data: {
        project: project,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Das Dialogfenster wurde geschlossen');
      this.projectService.loadProjects().subscribe();
    });
  }

  editName(project: Project) {
    const dialogRef = this.dialog.open(EditNameComponent, {
      width: '300px',
      data: {
        project: project,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Das Dialogfenster wurde geschlossen');
      this.projectService.loadProjects().subscribe();
    });
  }

}
