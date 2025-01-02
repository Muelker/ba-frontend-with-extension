import { Component, Input, OnDestroy } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs'; 
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { Project } from '../../interfaces/project';
import { VisualizationComponent } from '../visualization/visualization.component';
import { ImageDetailsComponent } from '../image-details/image-details.component';
import { Subscription } from 'rxjs';
import { InformationExchangeService } from '../../services/information-exchange.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [MatTabsModule, ProjectDetailComponent, VisualizationComponent, ImageDetailsComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnDestroy {
  selectedTabIndex = 0;
  private tabSubscription: Subscription;

  constructor(private informationExchangeService: InformationExchangeService) {
    this.tabSubscription = this.informationExchangeService.currentTab.subscribe(index => {
      this.selectedTabIndex = index;
    });
  }

  ngOnDestroy(): void {
    this.tabSubscription.unsubscribe();
  }
  
}
