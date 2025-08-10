import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontBeShyComponent } from './dont-be-shy.component';

describe('DontBeShyComponent', () => {
  let component: DontBeShyComponent;
  let fixture: ComponentFixture<DontBeShyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DontBeShyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DontBeShyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
