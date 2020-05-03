import { TestBed } from '@angular/core/testing';

import { EmpresasPrivadasService } from './empresas-privadas.service';

describe('EmpresasPrivadasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpresasPrivadasService = TestBed.get(EmpresasPrivadasService);
    expect(service).toBeTruthy();
  });
});
