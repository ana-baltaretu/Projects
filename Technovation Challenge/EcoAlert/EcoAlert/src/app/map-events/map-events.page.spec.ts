import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEventsPage } from './map-events.page';

describe('MapEventsPage', () => {
  let component: MapEventsPage;
  let fixture: ComponentFixture<MapEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
