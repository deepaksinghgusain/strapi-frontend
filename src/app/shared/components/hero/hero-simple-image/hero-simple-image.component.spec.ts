import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSimpleImageComponent } from './hero-simple-image.component';

describe('HeroSimpleImageComponent', () => {
  let component: HeroSimpleImageComponent;
  let fixture: ComponentFixture<HeroSimpleImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroSimpleImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSimpleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
