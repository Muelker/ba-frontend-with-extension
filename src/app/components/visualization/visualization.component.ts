import { Component, Input, OnChanges, SimpleChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project';
import { Image } from '../../interfaces/image';
import { Results } from '../../interfaces/results';
import { OverlayRecognition } from '../../interfaces/overlay_recognition';
import { ProjectService } from '../../services/project.service';
import { ResultsService } from '../../services/results.service';
import { InformationExchangeService } from '../../services/information-exchange.service';
import { Subscription } from 'rxjs';
import { SelectedProjectService } from '../../services/selected-project.service';
import { HttpClient } from '@angular/common/http';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SecurePipe } from '../../pipes/secure.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs'
import { ChangeOverlaysComponent } from '../change-overlays/change-overlays.component';
import { Overlay } from '@angular/cdk/overlay';
import { over } from 'cypress/types/lodash';
import { ChainResultSet } from '../../interfaces/chain_result_set';
import { ChainResult } from '../../interfaces/chain_result';
import { error } from 'cypress/types/jquery';
import { Detection } from '../../interfaces/detection';
import { CallEditButtonComponent } from '../call-edit-button/call-edit-button.component';
import { Router } from '@angular/router';
import { ExchangeService } from '../../services/exchange.service';



@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule, MatIconModule, SecurePipe, MatListModule, MatButtonModule, CallEditButtonComponent],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.scss'
})
export class VisualizationComponent implements OnInit, OnDestroy {
  selectedProject?: Project;
  private selectedProjectSubscription = new Subscription();

  private loadImagesSubscription: Subscription;
  private exchangeService: ExchangeService = inject(ExchangeService);

  constructor(private projectService: ProjectService, private resultsService: ResultsService, private informationExchangeService: InformationExchangeService, private selectedProjectService: SelectedProjectService, public dialog: MatDialog, private http: HttpClient, private router: Router) {
    this.loadImagesSubscription = this.informationExchangeService.executeFunction.subscribe(() => {
      this.images = [];
      this.loadImages();
    });
  }

  images: Image[] = [];
  overlays: OverlayRecognition[] = [];
  responseData?: Results[];
  chainResponseData?: ChainResultSet[];
  imageChainResultSet?: ChainResultSet;
  chainResults?: ChainResult[];

  selectedOverlay?: OverlayRecognition;

  selectedImage?: Image;

  selectImage(image: Image) {
    //this.getOverlaysForCurrentImg(image);
    this.getChainOverlaysForCurrentImg(image);
    this.selectedImage = image;
  }

  selectOverlay(overlay: OverlayRecognition, scroll: Boolean) {
    this.selectedOverlay = overlay;
    if(scroll) document.getElementById(`${overlay.id}`)?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  isSelected(overlay: OverlayRecognition) {
    if (this.selectedOverlay)
      return this.selectedOverlay === overlay;
    return false;
  }

  isSelectedImage(image: Image) {
    if (this.selectedImage)
      return this.selectedImage.id == image.id;
    return false;
  }

  ngOnInit() {
    this.selectedProjectSubscription = this.selectedProjectService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
      this.loadImages();
      this.overlays = [];
    });

    this.loadImages();
  }


  ngOnDestroy() {
    this.selectedProjectSubscription.unsubscribe();
    this.loadImagesSubscription.unsubscribe();
  }

  //Gets images from server.
  loadImages(): void {
    if (this.selectedProject && this.selectedProject.id !== undefined) {
      this.projectService.getImages(this.selectedProject.id).pipe(
        tap(data => {
          this.images = data;
        }),
        catchError(error => {
          // Fehlerbehandlung
          console.error(error);
          return of([]);
        })
      ).subscribe();

      // this.getResults();
      this.getChainResults();

    } else {
      console.error('Selected project is undefined (loadImages)');
    }
    this.selectedImage = undefined;
    this.reloadGallery();
  }

  //Gets Overlays from server. 
  getResults() {
    if (this.selectedProject) {
      this.resultsService.getOverlays(this.selectedProject.id).pipe(
        tap(response => {
          if (response) {
            this.responseData = response;
          }
        }),
        catchError(error => {
          console.error("Could not get Overlays", error);
          return of(null);
        })
      ).subscribe();
    }
  }

  getChainResults() {
    if (this.selectedProject) {
      console.log("getting chain results");
      this.resultsService.getChainOverlays(this.selectedProject.id).pipe(
        tap(response => {
          console.log(response);
          if (response) {
            // console.log(response);
            this.chainResponseData = response;
            // console.log(this.chainResponseData);
          }
        }),
        catchError(error => {
          console.error("Could not get Overlays", error);
          return of(null);
        })
      ).subscribe();
    }
  }

  getChainOverlaysForCurrentImg(image: Image) {
    console.log("getting overlays");
    console.log(this.chainResponseData);
    if (this.chainResponseData) {
      let index = -1;
      for (let i = 0; i < this.chainResponseData.length; i++) {
        if (image.id == this.chainResponseData[i].image_id) {
          index = i;
        }
      }

      if (index == -1) {
        this.overlays = [];
        console.log("index -1");
        return;
      }

      this.chainResults = Object.values(this.chainResponseData[index].results);

      console.log("this.chainResults");
      console.log(this.chainResults);


      let last_result_of_chain = this.chainResults?.[this.chainResults.length - 1].result;
      this.selectChainResultForOverlays(last_result_of_chain);

    }
    else console.log("no response data");
  }

  selectChainResultForOverlays(detection_element: { [key: string]: Detection; }) {
    if (this.chainResults) {
      console.log(detection_element);
      if (detection_element) {
        const result_keys = Object.keys(detection_element);

        if (result_keys.length > 0) {
          const firstKey = result_keys[0];
          this.overlays = detection_element[firstKey].elements;
          this.idForOverlays();
          console.log(this.overlays);
        }
      }
    }
  }

  getOverlaysForCurrentImg(image: Image) {
    if (this.responseData) {
      let index = -1;
      for (let i = 0; i < this.responseData.length; i++) {
        if (image.id == this.responseData[i].image_id) {
          index = i;
        }
      }

      if (index == -1) {
        this.overlays = [];
        return;
      }
      //First Object in responsdata.results_recognition (interface Results, results_recognition) has unknown name and has to be handeld as key of a map.
      const keys = Object.keys(this.responseData[index].result_recognition);

      if (keys.length > 0) {
        const firstKey = keys[0];

        this.overlays = this.responseData[index].result_recognition[firstKey].elements;
        this.idForOverlays();
      }
    }
  }

  //Styles for overlays have to be created dynamically
  getOverlayStyle(imageElement: HTMLImageElement, overlay: any) {
    const originalWidth = imageElement.naturalWidth;
    const originalHeight = imageElement.naturalHeight;

    const { scaleFactorWidth, scaleFactorHeight } = this.getScaleFactor(imageElement, originalWidth, originalHeight);

    //Scale Overlays to current img size with scaleFactor
    const left = overlay.bbox_xyxy_abs[0] * scaleFactorWidth;
    const top = overlay.bbox_xyxy_abs[1] * scaleFactorHeight;
    const width = (overlay.bbox_xyxy_abs[2] - overlay.bbox_xyxy_abs[0]) * scaleFactorWidth;
    const height = (overlay.bbox_xyxy_abs[3] - overlay.bbox_xyxy_abs[1]) * scaleFactorHeight;

    return {
      'position': 'absolute',
      'left.px': left,
      'top.px': top,
      'width.px': width,
      'height.px': height,
      'border': '2px solid rgba(255, 102, 0, .5)',
      'z-index': '10',
    };
  }

  //Scalefactor for Overlays
  getScaleFactor(imageElement: HTMLImageElement, originalWidth: number, originalHeight: number) {
    const scaleFactorWidth = imageElement.width / originalWidth;
    const scaleFactorHeight = imageElement.height / originalHeight;
    return { scaleFactorWidth, scaleFactorHeight };
  }

  reloadLables() {
    var container = document.getElementById("overlays");
    if (container) {
      var content = container.innerHTML;
      container.innerHTML = content;
    }
  }

  reloadGallery() {
    var container = document.getElementById("visualization-Gallery");
    if (container) {
      var content = container.innerHTML;
      container.innerHTML = content;
    }
  }

  changeOverlay(overlay: OverlayRecognition): void {
    const dialogRef = this.dialog.open(ChangeOverlaysComponent, {
      width: '300px',
      data: {
        overlay: overlay,
      }
    });
  }

  downloadImg(image: Image) {
    if (this.responseData) {
      let results_url: string = '';

      for (let i = 0; i < this.responseData.length; i++) {
        if (this.responseData[i].image_id == image.id) {
          results_url = this.responseData[i].text_recognition_image_url;
        }
      }

      if (results_url != '') {
        this.http.get(results_url, { responseType: 'blob' }).subscribe(blob => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);

          a.href = objectUrl;
          a.download = image.old_name;
          a.click();

          URL.revokeObjectURL(objectUrl);
        });
      }
    }
  }

  idForOverlays() {
    for(let overlay of this.overlays) {
      overlay.id = this.genUniqueId();
    }
  }

  genUniqueId(): string {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify

    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point

    return `${dateStr}-${randomStr}`;
  }

  goToEditView(): void
  {
    if(this.selectedImage && this.selectedProject && this.chainResults)
    {
      var index: number = -1;
      for(var i: number = 0; i < this.chainResults.length; i++)
      {
        if(this.selectedImage.id === this.chainResults[i].image_id)
        {
          index = i;
        }
      }

      const keys = Object.keys(this.chainResults[index].result);
      const firstKey = keys[0];
      
      console.log(this.chainResults[index].result[firstKey].elements);
      this.exchangeService.setImage(this.selectedImage.image_url,
                                    this.selectedImage.id,
                                    this.selectedProject.id);
      var sendArr: OverlayRecognition[] = this.chainResults[index].result[firstKey].elements;
      console.log(sendArr);
      this.exchangeService.setResult(sendArr);
      this.router.navigate(['/edit-results']);
    }
    else if(this.selectedImage && this.selectedProject && !this.chainResults)
    {
      var confirmText = "Aktuell gibt es kein Ergebnis für dieses Bild. Soll das Bearbeitungsfenster trotzdem geöffnet werden?"
      if(confirm(confirmText))
      {
        var sendArr: OverlayRecognition[] = [];

        /* Used during example
        var array = [[5, 993, 59, 106, "1.51"],
                     [0, 1406, 59, 112, "3.12"],
                     [372, 1843, 84, 131, "1,"],
                     [378, 2001, 354, 134, "45.20"],
                     [363, 2666, 1737, 290, "OBERGESCHOSS"],
                     [501, 1819, 849, 169, "Obergeschoß"],
                     [779, 1989, 184, 123, "m2"],
                     [685, 1180, 363,79, "Schlafraum"],
                     [685, 1262, 193, 70, "20.29"],
                     [890, 1268, 93, 64, "m2"],
                     [1040, 600, 583, 126, "Nachbarhaus"],
                     [1541, 1488, 128, 61, "8.42"],
                     [1535, 1403, 213, 67, "Kammer"],
                     [1687, 1491, 82, 58, "m2"],
                     [1617, 1049, 123, 67, "Flur"],
                     [1758, 1049, 134, 70, "8.25"],
                     [1904, 1049, 87, 79, "m2"],
                     [2027, 1128, 38, 46, "F"],
                     [2036, 1075, 213, 49, "Unterseite"],
                     [2074, 1128, 61, 46, "90"],
                     [2039, 1482, 128, 70, "8.26"],
                     [2030, 1397, 413, 79, "Abstellkammer"],
                     [2180, 1485, 87, 64, "m2"],
                     [2432, 1274, 52, 401, "Wandkonstr.:F90"],
                     [2127, 336, 114, 120, "2,"],
                     [2133, 483, 293, 131, "15.70"],
                     [2221, 225, 49, 46, "31"],
                     [2282, 336, 741, 131, "Obergeschoß" ],
                     [2352, 70, 84, 70, "1.41"],
                     [2449, 483, 172, 123, "m2"],
                     [2191, 1936, 108, 64, "3.06"],
                     [2476, 219, 117, 58,  "2.93"],
                     [2555, 1479,  134,  73, "7.49"],
                     [2490, 1945, 49, 49, "12"],
                     [2704, 1482, 96, 73, "m2"],
                     [2549, 1394, 433, 82, "Abstellkammer"],
                     [2552, 1051, 131, 64, "6.48"],
                     [2546, 966, 281, 84, "Windfang"],
                     [2687, 823, 120, 82, "1.73"],
                     [2713, 84, 114, 58, "2.78"],
                     [2728, 1945, 114, 61, "2.78"],
                     [2760, 222, 49, 61, "12"],
                     [2692, 1051, 93, 64, "m2"],
                     [2854, 222, 82, 55, "1.14"],
                     [2818, 826, 87, 84, "m2"],
                     [2892, 717, 108, 84, "WC."],
                     [3018, 1936, 67, 64, "37"],
                     [2994, 222, 58, 49, "37"],
                     [3088, 342, 79, 58, "75"],
                     [3094, 955, 49, 199, "1.01/2.00"],
                     [3111, 1632, 52, 117, "2626" ],
                     [3106, 676, 275, 55, "Motorlüftung" ],
                     [3240, 348, 87, 46, "1.00" ],
                     [3205, 1769, 52, 49, "13"],
                     [3205, 1831, 134, 46, "18/26"],
                     [3202, 1895, 158, 55, "Treppe"],
                     [3199, 1957, 82, 58, "mit"],
                     [3264, 1764, 146, 64, "Steig."],
                     [3287, 1960, 243, 55, "Steinstufen"],
                     [3369, 1898, 52, 52, "in"],
                     [3422, 1890, 410, 76, "Stahlkonstruktion"],
                     [3460, 1684, 49, 73, "38" ],
                     [3451, 1380, 52, 117, "2.70"],
                     [3445, 1169, 55, 58, "15"],
                     [3445, 1013, 52, 102, "1.37" ],
                     [3440, 902, 58, 61, "12"],
                     [3437, 735, 61, 96, "1.52"],
                     [3428, 600, 70, 70, "25"],
                     [3709, 1509,  55, 64, "12"],
                     [3697, 1186, 58, 117, "3.21"],
                     [3697, 911, 61, 58, "24"],
                     [3900,  1049, 61, 213,  "Falleitung"],
                     [3897, 961, 52, 76, "NW"],
                     [3897, 873, 49, 79, "100"],
                     [3914, 1268, 43, 222, "vorhandene"]
                    ];

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
        */
        this.exchangeService.setImage(this.selectedImage.image_url,
                                this.selectedImage.id,
                                this.selectedProject.id);
        this.exchangeService.setResult(sendArr);
        this.router.navigate(['/edit-results']);
      }
    }
    else
    {
      console.log("SelectedImage: " + this.selectedImage + ", SelectedProject: " + this.selectedProject + ", ChainResults: " + this.chainResults);
    }
  }
}
