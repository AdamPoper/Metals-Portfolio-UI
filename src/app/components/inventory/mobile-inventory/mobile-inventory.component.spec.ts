import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileInventoryComponent } from './mobile-inventory.component';

describe('MobileInventoryComponent', () => {
  let component: MobileInventoryComponent;
  let fixture: ComponentFixture<MobileInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
