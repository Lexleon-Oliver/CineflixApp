import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePlayerComponent } from './online-player.component';

describe('OnlinePlayerComponent', () => {
  let component: OnlinePlayerComponent;
  let fixture: ComponentFixture<OnlinePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlinePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlinePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
