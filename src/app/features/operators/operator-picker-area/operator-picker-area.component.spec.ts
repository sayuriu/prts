import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorPickerAreaComponent } from './operator-picker-area.component';

describe('OperatorPickerAreaComponent', () => {
  let component: OperatorPickerAreaComponent;
  let fixture: ComponentFixture<OperatorPickerAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorPickerAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPickerAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
