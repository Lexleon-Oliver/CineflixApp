import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderizaMidiaComponent } from './renderiza-midia.component';

describe('RenderizaMidiaComponent', () => {
  let component: RenderizaMidiaComponent;
  let fixture: ComponentFixture<RenderizaMidiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderizaMidiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderizaMidiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
