import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Register1Page } from './register1.page';

describe('Register1Page', () => {
  let component: Register1Page;
  let fixture: ComponentFixture<Register1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Register1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Register1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
