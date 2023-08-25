import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookedComponent } from './cooked.component';

describe('CookedComponent', () => {
  let component: CookedComponent;
  let fixture: ComponentFixture<CookedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookedComponent]
    });
    fixture = TestBed.createComponent(CookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
