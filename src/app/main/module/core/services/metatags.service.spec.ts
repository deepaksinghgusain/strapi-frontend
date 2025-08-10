import { TestBed } from '@angular/core/testing';

import { MetatagsService } from './metatags.service';

describe('MetatagsService', () => {
  let service: MetatagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetatagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
