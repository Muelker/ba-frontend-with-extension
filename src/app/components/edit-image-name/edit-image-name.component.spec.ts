import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageNameComponent } from './edit-image-name.component';

describe('EditDescriptionComponent', () => {
  let component: EditImageNameComponent;
  let fixture: ComponentFixture<EditImageNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditImageNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditImageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
