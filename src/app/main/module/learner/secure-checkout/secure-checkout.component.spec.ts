import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureCheckoutComponent } from './secure-checkout.component';

describe('SecureCheckoutComponent', () => {
  let component: SecureCheckoutComponent;
  let fixture: ComponentFixture<SecureCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecureCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
