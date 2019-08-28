import { Component, OnInit } from '@angular/core';
import { AngularFireObject } from '@angular/fire/database/interfaces';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth'
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import * as firebase from 'Firebase';
import { Event } from '../events/event';
import {Subject} from 'rxjs';
import { AlertController } from '@ionic/angular'
import { Router, NavigationExtras } from '@angular/router'
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';

import { NavController, ModalController } from '@ionic/angular';
import { MapChooseLocationPage } from '../map-choose-location/map-choose-location.page';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  event = {} as Event;
  myId = null;
  name: string;
  category: string;
  date: string;
  startHour: string;
  description: string;
  markerType: any;
  /**
  ref = firebase.database().ref('/events/');
  */
  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public plt: Platform,
    public nav: NavController,
  ) { }

  ngOnInit() {
    this.category = "centerMarker";
  }

  loadMarker()
    {
      console.log(this.markerType);
      if (this.markerType == 1)
        this.category = "bikeMarker";
      else if (this.markerType == 2)
      this.category = "bottleMarker";
      else if (this.markerType == 3)
      this.category = "treeMarker";
      else if (this.markerType == 4)
      this.category = "waterMarker";
      else this.category = "otherMarker";
    }


  async chooseLocation() {
    if(typeof(this.name) === "undefined")
      this.showAlert("Please fill in event name", "Error");
    else if(typeof(this.category) === "undefined")
      this.showAlert("Please fill in event category", "Error");
    else if(typeof(this.date) === "undefined")
      this.showAlert("Please fill in event date", "Error");
    else if(typeof(this.description) === "undefined")
      this.showAlert("Please fill in event description", "Error");
    else if(typeof(this.startHour) === "undefined")
      this.showAlert("Please fill in event start hour", "Error");
    else 
    {
      let navigationExtras: NavigationExtras =
      {
        state: {
          name: this.name,
          category: this.category,
          date: this.date,
          startHour: this.startHour,
          description: this.description
        }
      }
      this.router.navigate(['map-choose-location'], navigationExtras);
    }
  }

/**
      async addEvent(event: Event) {
        try {
               this.afAuth.authState.subscribe(auth => {
                  let newEventRef = this.ref.push({});

                  newEventRef.set({
                    id: newEventRef.key,
                    name: event.name,
                    category: event.category,
                    date: event.date,
                    startHour: event.startHour,
                    description: event.description,
                    location: event.location,
                   /// geoLocationLat: this.navParams.get('geoLocationLat'),
                    //geoLocationLng: this.navParams.get('geoLocationLng'),
                  });
                })
            this.showAlert("Event added!", "ok!")
            this.router.navigate(['/tabs/tab4'])
        } catch(error) {
            console.dir(error)
            this.showAlert("Error", error.message)
        }
    }
*/
    async showAlert(header: string, message: string) {
      const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })
    await alert.present()
    }


}
