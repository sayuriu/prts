import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentComponent } from './recruitment.component';

describe('RecruitmentComponent', () => {
  let component: RecruitmentComponent;
  let fixture: ComponentFixture<RecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
