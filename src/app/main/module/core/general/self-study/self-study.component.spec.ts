import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfStudyComponent } from './self-study.component';

describe('SelfStudyComponent', () => {
  let component: SelfStudyComponent;
  let fixture: ComponentFixture<SelfStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
