import { TestBed } from '@angular/core/testing';

import { SelectedProjectService } from './selected-project.service';

describe('SelectedProjectService', () => {
  let service: SelectedProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
