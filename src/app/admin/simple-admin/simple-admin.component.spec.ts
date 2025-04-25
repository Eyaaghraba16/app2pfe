import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAdminComponent } from './simple-admin.component';

describe('SimpleAdminComponent', () => {
  let component: SimpleAdminComponent;
  let fixture: ComponentFixture<SimpleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
