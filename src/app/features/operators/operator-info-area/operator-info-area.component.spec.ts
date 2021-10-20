import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorInfoAreaComponent } from './operator-info-area.component';

describe('OperatorInfoAreaComponent', () => {
  let component: OperatorInfoAreaComponent;
  let fixture: ComponentFixture<OperatorInfoAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorInfoAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorInfoAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
