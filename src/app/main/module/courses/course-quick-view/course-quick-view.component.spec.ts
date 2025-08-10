import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseQuickViewComponent } from './course-quick-view.component';

describe('CourseQuickViewComponent', () => {
  let component: CourseQuickViewComponent;
  let fixture: ComponentFixture<CourseQuickViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseQuickViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseQuickViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
