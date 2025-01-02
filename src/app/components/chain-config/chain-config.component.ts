import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import { AiChainModule } from '../../interfaces/ai_chain_module';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-chain-config',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './chain-config.component.html',
  styleUrl: './chain-config.component.scss'
})
export class ChainConfigComponent {
  @Input() available: AiChainModule[] = [];
  selected: AiChainModule[] = [];
  @Output() getSelectedEvent: EventEmitter<AiChainModule[]> = new EventEmitter<AiChainModule[]>();
  

  drop(event: CdkDragDrop<AiChainModule[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.sendSelectedToParent();
  }

  sendSelectedToParent() {
    this.getSelectedEvent.emit(this.selected);
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }

  onDelete(item: AiChainModule) {
    let index = this.selected.indexOf(item, 0);
    if (index > -1) this.selected.splice(index, 1);
  }
}
