import { TestBed } from '@angular/core/testing';

import { SectoresService } from './sectores.service';

describe('SectoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectoresService = TestBed.get(SectoresService);
    expect(service).toBeTruthy();
  });
});
