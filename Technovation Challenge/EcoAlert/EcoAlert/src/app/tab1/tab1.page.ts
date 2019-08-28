import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { Event } from '../events/event';
import { map } from 'rxjs/operators';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  event = {} as Event;
  public eventsList: Observable<any>;
  public eventData =[];
  ref = firebase.database().ref('/events/');
  constructor(
    public afd: AngularFireDatabase,
    public router: Router
  ) {

    this.eventsList = this.afd.list('events').valueChanges();

  }

  ngOnInit() {
  }

  async itemSelected(eventSelected: Event) {
    let eventId = eventSelected.id;
    this.router.navigate(['/event-details/' + eventId]);
  }
  async mapClicked() {
    this.router.navigate(['/map-events']);
  }
  ionViewDidLoad() {
        const eventRef: firebase.database.Reference = firebase.database().ref(`/events/`);
        eventRef.on('value', eventSnapshot => {
            let myEvent = eventSnapshot.val();
            for(let k in myEvent){
               this.eventData.push({
                    id : k,
                    name: this.eventData[k].name,
                    category: this.eventData[k].category,
                    date: this.eventData[k].date,
                    startHour: this.eventData[k].startHour,
                    description: this.eventData[k].description,
                    location: this.eventData[k].location,
                    geoLocationLat: this.eventData[k].geoLocationLat,
                    geoLocationLng: this.eventData[k].geoLocationLng
                 });
            }
        });
    }

    public getEvents() {
      return this.eventData;
    }
    getEvent(id) {
      return this.eventData[id];
    }
    removeEvent(id) {
      return this.eventData[id].delete();
    }
}
