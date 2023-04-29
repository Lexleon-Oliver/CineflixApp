import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSerieComponent } from './selected-serie.component';

describe('SelectedSerieComponent', () => {
  let component: SelectedSerieComponent;
  let fixture: ComponentFixture<SelectedSerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSerieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
