import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageListingComponent } from './package-listing.component';

describe('PackageListingComponent', () => {
  let component: PackageListingComponent;
  let fixture: ComponentFixture<PackageListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
