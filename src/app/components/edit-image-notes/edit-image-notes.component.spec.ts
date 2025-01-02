import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageNotesComponent } from './edit-image-notes.component';

describe('EditDescriptionComponent', () => {
  let component: EditImageNotesComponent;
  let fixture: ComponentFixture<EditImageNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditImageNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditImageNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
