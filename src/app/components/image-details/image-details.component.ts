import {  Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'

import {MatIconModule} from '@angular/material/icon'; 
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



import { SelectedProjectService } from '../../services/selected-project.service';
import { SecurePipe } from '../../pipes/secure.pipe';
import { Image } from '../../interfaces/image';
import { Project } from '../../interfaces/project';
import { ProjectService } from '../../services/project.service';
import { EditImageNotesComponent } from '../edit-image-notes/edit-image-notes.component';
import { EditImageNameComponent } from '../edit-image-name/edit-image-name.component';
import { InformationExchangeService } from '../../services/information-exchange.service';
import { Router } from '@angular/router';
import { ExchangeService } from '../../services/exchange.service';
import { OverlayRecognition } from '../../interfaces/overlay_recognition';


@Component({
  selector: 'app-image-details',
  standalone: true,
  imports: [CommonModule, SecurePipe, MatIconModule, MatButtonModule],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.scss'
})
export class ImageDetailsComponent implements OnInit, OnDestroy  {

  private loadImagesSubscription: Subscription;
  // private exchangeService: ExchangeService = inject(ExchangeService);

  constructor( private dialog: MatDialog, private selectedProjectService: SelectedProjectService, private informationExchangeService: InformationExchangeService, private projectService: ProjectService, private router: Router) {
    this.loadImagesSubscription = this.informationExchangeService.executeFunction.subscribe(() => {
      this.images = [];
      this.loadImages();
    }); 
   }

  imageDetails = {name: "", notes: ""}
  images: Image[] = [];
  selectedProject?: Project;
  selectedImage?: Image;

  private selectedProjectSubscription = new Subscription();

  /*
  goToEditView(): void
  {
    //console.log("media/project_"+this.selectedProject?.id+"/"+this.selectedImage?.name);
    if(this.selectedImage && this.selectedProject)
    {
      var array = [[194, 1824, 135, 31, "MAKUUH.", true],
                   [207, 676, 135, 31, "MAKUUH.", true],
                   [259, 1075, 125, 33, "TERASSI", true],
                   [418, 1610, 90, 42, "piippu", true],
                   [431, 463, 90, 42, "piippu", true],
                   [475, 1905, 39, 34, "TK", true],
                   [649, 620, 81, 32, "AULA", true],
                   [733, 1319, 112, 37, "KEITTIÖ", true],
                   [746, 176, 138, 31, "MAKUUH.", true],
                   [868, 1920, 60, 33, "VAR", true],
                   [597, 1424, 14, 30, "I", true],
                   [1132, 176, 138, 31, "MAKUUH.", true],
                   [1184, 759, 40, 32, "VH", true],
                   [1492, 1824, 94, 34, "KUISTI", true],
                   [1505, 1175, 117, 157, "E", true],
                   [1999, 1777, 90, 32, "PATIO", true]
                  ];



      var sendArr : OverlayRecognition[] = [];

      for(var i: number = 0; i < array.length; i++)
      {
        var tempW = (parseInt(array[i][0].toString()) + parseInt(array[i][2].toString()));
        var tempH = (parseInt(array[i][1].toString()) + parseInt(array[i][3].toString()));

        var tempOverlay = <OverlayRecognition>{id: "1",
                                               guid: "0", 
                                               class_id: 0, 
                                               confidence: 0.4589, 
                                               bbox_xyxy_abs: [array[i][0],
                                                               array[i][1],
                                                               tempW,
                                                               tempH],
                                               text: array[i][4]}
        sendArr.push(tempOverlay);
      }
      //console.log(sendArr);
      

      this.exchangeService.setImage(this.selectedImage.image_url,
                                    this.selectedImage.id,
                                    this.selectedProject.id);
      this.exchangeService.setResult(sendArr);
      this.router.navigate(['/edit-results']);
    }
  }
  */

  ngOnInit(): void {
    this.selectedProjectSubscription = this.selectedProjectService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
      this.loadImages();
      this.selectedImage = undefined;
    });
  }

  ngOnDestroy(): void {
      
  }

  loadImages() {
    if (this.selectedProject && this.selectedProject.id !== undefined) {
      this.projectService.getImages(this.selectedProject.id).pipe(
        tap(data => {
          this.images = data;
          console.log('Daten erfolgreich geladen (visualization)');
        }),
        catchError(error => {
          // Fehlerbehandlung
          console.error(error);
          return of([]);
        })
      ).subscribe();

    } else {
      console.error('Selected project is undefined (canvas)');
    }
    this.selectedImage = undefined;
  }

  selectImage(image: Image) {
    this.selectedImage = image;
  }

  editNotes(image: Image) {
    const dialogRef = this.dialog.open(EditImageNotesComponent, {
      width: '300px',
      data: {
        image: image,
      }
    }); 

    dialogRef.afterClosed().subscribe(result => {
      console.log('Das Dialogfenster wurde geschlossen');
    });
  }

  editName(image: Image) {
    const dialogRef = this.dialog.open(EditImageNameComponent, {
      width: '300px',
      data: {
        image: image,
      }
    }); 

    dialogRef.afterClosed().subscribe(result => {
      console.log('Das Dialogfenster wurde geschlossen');

    });
  }
}
