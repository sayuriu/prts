import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidScreenComponent } from './invalid-screen.component';

describe('InvalidScreenComponent', () => {
  let component: InvalidScreenComponent;
  let fixture: ComponentFixture<InvalidScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
