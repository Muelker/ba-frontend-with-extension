import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallEditButtonComponent } from './call-edit-button.component';

describe('CallEditButtonComponent', () => {
  let component: CallEditButtonComponent;
  let fixture: ComponentFixture<CallEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallEditButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
