import { TestBed } from '@angular/core/testing';

import { CourseDetailGuard } from './course-detail.guard';

describe('CourseDetailGuard', () => {
  let guard: CourseDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CourseDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
