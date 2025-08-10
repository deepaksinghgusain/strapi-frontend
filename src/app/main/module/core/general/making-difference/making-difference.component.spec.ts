import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakingDifferenceComponent } from './making-difference.component';

describe('MakingDifferenceComponent', () => {
  let component: MakingDifferenceComponent;
  let fixture: ComponentFixture<MakingDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakingDifferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakingDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
