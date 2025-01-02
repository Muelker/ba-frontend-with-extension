import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOverlaysComponent } from './change-overlays.component';

describe('ChangeOverlaysComponent', () => {
  let component: ChangeOverlaysComponent;
  let fixture: ComponentFixture<ChangeOverlaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeOverlaysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeOverlaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
