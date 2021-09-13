import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLevelUIComponent } from './top-level-ui.component';

describe('TopLevelUIComponent', () => {
  let component: TopLevelUIComponent;
  let fixture: ComponentFixture<TopLevelUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopLevelUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLevelUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
