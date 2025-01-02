import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainConfigComponent } from './chain-config.component';

describe('ChainConfigComponent', () => {
  let component: ChainConfigComponent;
  let fixture: ComponentFixture<ChainConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChainConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
