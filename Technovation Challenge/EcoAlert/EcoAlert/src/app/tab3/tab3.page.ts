import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import * as firebase from 'Firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Observable } from 'rxjs';
import { Event } from '../events/event';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{
  


  ///DISPLAY THE NOTIFICATIONS LIST FOR EACH PERSON
  ///REMOVE AFTER A SET TIME FRAME

  buttonText: any;

  myId = null;
  public items = [];
  public name = null;
  public email = null;
  public userProperties: Observable<any>;
  public eventsList: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    public afd: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public router: Router,
    public webview: WebView
  ) {

    this.afAuth.authState.subscribe(user =>{
      if(user) {
        this.myId = user.uid;  
        console.log(this.myId);
        this.eventsList = this.afd.list('users/' + this.myId + '/zNotificationsList').valueChanges();
        this.userProperties = this.afd.list('users/' + this.myId).valueChanges();
        this.userProperties.subscribe(
          data => {
            this.items = data;
            console.log(this.items);
            console.log(this.items[0]);
            console.log(this.items[1]);
            console.log(this.items[2]);
            console.log(this.items[3]);
            console.log(this.items[4]);
            console.log(this.items[5]);
            console.log(this.items[7]);
            console.log(this.items[8]);
          }
        )
      }
    });
    this.buttonText = "Set notifications radius";
  }

  setNotificationRadius()
  {
    if (this.items[4] == 0)
    {
      let navigationExtras: NavigationExtras =
      {
        state: {
          markerOnMap: 0,
          range: 5,
          geoLocationLat: 0,
          geoLocationLng: 0
        }
      }
      //this.buttonText = "Set notifications radius";
      this.router.navigate(['notifications-range'], navigationExtras);
      console.log(this.items[4]);
    }
    else if (this.items[4] != 0)
    {
      let navigationExtras: NavigationExtras =
      {
        state: {
          markerOnMap: 1,
          range: this.items[7], ///radius
          geoLocationLat: this.items[2], ///lat
          geoLocationLng: this.items[3] ///lng
        }
      }
      this.router.navigate(['notifications-range'], navigationExtras);
    }
  }
  async itemSelected(eventSelected: Event) {
    let eventId = eventSelected.id;
    this.router.navigate(['/event-details/' + eventId]);
  }

}
