import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorImgComponent } from './operator-img.component';

describe('OperatorImgComponent', () => {
  let component: OperatorImgComponent;
  let fixture: ComponentFixture<OperatorImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
