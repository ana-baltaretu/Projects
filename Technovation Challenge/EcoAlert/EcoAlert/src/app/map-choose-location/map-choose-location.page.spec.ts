import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChooseLocationPage } from './map-choose-location.page';

describe('MapChooseLocationPage', () => {
  let component: MapChooseLocationPage;
  let fixture: ComponentFixture<MapChooseLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapChooseLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChooseLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
