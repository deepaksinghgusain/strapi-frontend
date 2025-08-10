import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSimpleComponent } from './hero-simple.component';

describe('HeroSimpleComponent', () => {
  let component: HeroSimpleComponent;
  let fixture: ComponentFixture<HeroSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
