import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'Firebase';
import { AngularFireAuth } from '@angular/fire/auth'

import { Event } from '../events/event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  eventId = null;
  items;
  items2;
  items3;
  items4;
  nrParticipants = null;
  userId = null;
  event: AngularFireObject<any>;
  property = {} as Event;
  myId = null;

  eventDate: string;

  public eventData =[];
  public eventProperties: Observable<any>;
  public eventParticipants: Observable<any>;
  public userProperties: Observable<any>;

  segmentType: any;
  public base64Image: string;

  ref=firebase.database().ref('/users/');
  ref2=firebase.database().ref('/events/');


  constructor(private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    public afd: AngularFireDatabase) {  
      this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId');
      this.eventProperties = this.afd.list('/events/' + this.eventId).valueChanges();
      this.eventParticipants = this.afd.list('/events/' + this.eventId + '/participantsList').valueChanges();
      
      this.afAuth.authState.subscribe(user =>{
        if(user) {
          this.userId = user.uid;  
          this.userProperties = this.afd.list('/users/' + this.userId).valueChanges();
          console.log(this.userId);
        }
      });
      this.segmentType = "details";
    }


    ionViewDidLoad() {
      this.eventProperties.subscribe(
        data => {
          this.items = data;
          this.base64Image = this.items[10];
          this.eventDate = this.items[1];
        }
      );
      this.eventParticipants.subscribe(
        data => {
          this.items2 = data;
          this.nrParticipants = this.items2.length;
          
        }
      );
      
    }
 
    participateAtTheEvent() {
       this.afAuth.authState.subscribe(auth => {
            let UserEventsRef = this.ref.child(auth.uid).child('eventsList').child(this.eventId);
            
            this.eventProperties.subscribe(
              data => {
                this.items3 = data;
                UserEventsRef.set({
                  category: this.items3[0],
                  date: this.items3[1],
                  description: this.items3[2],
                  geoLocationLat: this.items3[3],
                  geoLocationLng: this.items3[4],
                  id: this.eventId,
                  idCreator: this.items3[6],
                  name: this.items3[7],
                  startHour: this.items3[9]
    
                });
              }
            );
            
            let ParticipantsAtEventRef = this.ref2.child(this.eventId).child('participantsList').child(auth.uid);
            this.userProperties.subscribe(
              data => {
                this.items4 = data;
                ParticipantsAtEventRef.set({
                  id: this.items4[5],
                  username: this.items4[8],
                  email: this.items4[0],
                  homeLat: this.items4[2],
                  homeLng: this.items4[3],
                  radius: this.items4[7],
                  homeLocationSet: this.items4[4],
                  photo: this.items4[6],
                  zNotificationsList: this.items4[9]
                });

                
              }
            );
            
           
      })
    }
  ngOnInit() {
    this.ionViewDidLoad();
  }

  segmentChanged(ev: any) {
    this.segmentType = ev.detail.value;
  }

}
