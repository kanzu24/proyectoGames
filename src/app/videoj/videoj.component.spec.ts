import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojComponent } from './videoj.component';

describe('VideojComponent', () => {
  let component: VideojComponent;
  let fixture: ComponentFixture<VideojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
