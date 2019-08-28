import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsRangePage } from './notifications-range.page';

describe('NotificationsRangePage', () => {
  let component: NotificationsRangePage;
  let fixture: ComponentFixture<NotificationsRangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsRangePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsRangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
