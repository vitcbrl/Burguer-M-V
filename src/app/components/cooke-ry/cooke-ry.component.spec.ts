import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookeRyComponent } from './cooke-ry.component';

describe('CookeRyComponent', () => {
  let component: CookeRyComponent;
  let fixture: ComponentFixture<CookeRyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookeRyComponent]
    });
    fixture = TestBed.createComponent(CookeRyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
