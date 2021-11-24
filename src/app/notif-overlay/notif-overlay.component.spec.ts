import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifOverlayComponent } from './notif-overlay.component';

describe('NotifOverlayComponent', () => {
  let component: NotifOverlayComponent;
  let fixture: ComponentFixture<NotifOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
