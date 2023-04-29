import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererizaFilmeComponent } from './rendereriza-filme.component';

describe('RendererizaFilmeComponent', () => {
  let component: RendererizaFilmeComponent;
  let fixture: ComponentFixture<RendererizaFilmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RendererizaFilmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RendererizaFilmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
