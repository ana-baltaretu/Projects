import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth'
import { AlertController } from '@ionic/angular'
import { Event } from '../events/event';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import * as firebase from 'firebase';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  ///VARIABLES
  name: string;
  category: any;
  date: string;
  startHour: string;
  description: string;
  geoLocationLat: any;
  geoLocationLng: any;
  myId = null;
  items3;

  public base64Image: string;

  public usersList: Observable<any>;
  
  public eventProperties: Observable<any>;

  newEventRef;
  items;

  event = {} as Event;

  ref = firebase.database().ref('/events/');
  ref2 = firebase.database().ref('/users/');

  constructor(
    public afd: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public alert: AlertController,


    public router: Router,
    private activatedRoute: ActivatedRoute,
    public camera: Camera
  ) {

    this.usersList = this.afd.list('users').valueChanges();

    this.afAuth.authState.subscribe(user =>{
      if(user) {
        this.myId = user.uid;
      }
    });

    this.name = "Not set.";
    this.category = "Other";
    this.date = "Not set.";
    this.startHour = "Not set.";
    this.description = "No description.";
    this.geoLocationLat = "Not set.";
    this.geoLocationLng = "Not set.";
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state)
      {
        if (this.router.getCurrentNavigation().extras.state.name)///NOT EMPTY
          this.name = this.router.getCurrentNavigation().extras.state.name;

        if (this.router.getCurrentNavigation().extras.state.category != "centerMarker")///NOT EMPTY
          this.category = this.router.getCurrentNavigation().extras.state.category;

        if (this.router.getCurrentNavigation().extras.state.date)///NOT EMPTY
          this.date = this.router.getCurrentNavigation().extras.state.date;

        if (this.router.getCurrentNavigation().extras.state.startHour)///NOT EMPTY
          this.startHour = this.router.getCurrentNavigation().extras.state.startHour;

        if (this.router.getCurrentNavigation().extras.state.description)///NOT EMPTY
          this.description = this.router.getCurrentNavigation().extras.state.description;

        if (this.router.getCurrentNavigation().extras.state.geoLocationLat)///NOT EMPTY
          this.geoLocationLat = this.router.getCurrentNavigation().extras.state.geoLocationLat;

        if (this.router.getCurrentNavigation().extras.state.geoLocationLng)///NOT EMPTY
          this.geoLocationLng = this.router.getCurrentNavigation().extras.state.geoLocationLng;
      }
    })

   }

  ngOnInit() {
  }

  goBack()
  {
    this.router.navigate(['map-choose-location']);
  }

  checkEventData()
  {
    if (this.name != "Not set." && this.date != "Not set." && this.startHour != "Not set." &&
          this.geoLocationLat != "Not set." && this.geoLocationLng != "Not set.")
        {
          this.addEvent();
        }
        else
        {
          this.showAlert("Error", "Please fill all the required fields");
        }
  }


  takePhoto(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.base64Image);
      this.afAuth.authState.subscribe(user =>{
        if(user) {
          this.myId = user.uid;  
          console.log(this.myId);
          let UserRef = this.ref.child(this.myId);
          UserRef.set({
            id: this.items[5],
            username: this.items[8],
            email: this.items[0],
            eventsList: this.items[1],
            homeLat: this.items[2],
            homeLng: this.items[3],
            radius: this.items[7],
            homeLocationSet: this.items[4],
            photo: this.base64Image,
            zNotificationsList: this.items[9]
          });
        
        }
      });
    }, (err) => {
      
      console.log(err);
      // Handle error
    });
  }


  async addEvent() {
      try {
          this.afAuth.authState.subscribe(auth => {
              this.newEventRef = this.ref.push({});

              
              this.eventProperties = this.afd.list('events/' + this.newEventRef.key).valueChanges();
              this.newEventRef.set({
                id: this.newEventRef.key,
                name: this.name,
                category: this.category,
                date: this.date,
                startHour: this.startHour,
                description: this.description,
                participantsList: 0,
                ///location: event.location, ///POATE BAGAM ADRESA AICI
                geoLocationLat: this.geoLocationLat,
                geoLocationLng: this.geoLocationLng,
                idCreator: this.myId,
                z1Photo: this.base64Image
              });
            })
        
            this.notifyAllUsers();

        this.showAlert("Event added!", "Congratulations!")
        this.router.navigate(['/tabs/tab1'])
      } catch(error) {
          console.dir(error)
          this.showAlert("Error", error.message)
      }
  }

    async showAlert(header: string, message: string) {
      const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })
    await alert.present()
    }

    notifyAllUsers()
    {
      this.usersList.subscribe(
        data => {
          this.items = data;
          for(var i = 0; i < this.items.length; i++)
          {
            if (this.items[i].homeLocationSet == 1)
            {
              /// Calculeaza daca userul e in raza evenimentului
              var x = this.abs(this.items[i].homeLat - this.geoLocationLat);
              var y = this.abs(this.items[i].homeLng - this.geoLocationLng);
              var d = this.calculate(x, y); ///DISTANTA DE LA EVENT LA USER

              if (d < this.items[i].radius ||  this.abs(d - this.items[i].radius) < 10)
              {
                /// BAGA NOTIFICARI IN BAZA DE DATE pt user[i]
                console.log(this.items[i].username, "is in range");
                let UserNotificationsRef = this.ref2.child(this.items[i].id).child('zNotificationsList/').child(this.newEventRef.key);
                this.eventProperties.subscribe(
                  data => {
                    this.items3 = data;
                    UserNotificationsRef.set({
                      category: this.items3[0],
                      date: this.items3[1],
                      description: this.items3[2],
                      geoLocationLat: this.items3[3],
                      geoLocationLng: this.items3[4],
                      id: this.items3[5],
                      idCreator: this.items3[6],
                      name: this.items3[7],
                      startHour: this.items3[9]
                    })
                 });
                
              }
              else console.log(this.items[i].username, "is NOT in range");
            }
            else console.log("location not set for user ", this.items[i].username);
          }
        }
      );
    }

    calculate(x: any, y: any)
    {
      ///CALCULEAZA RAZA
      var d = (x*x + y*y);
      console.log("100000", 100000 * Math.sqrt(d));
      return 100000 * Math.sqrt(d);
    }

    abs(numar: any)
    {
      if (numar > 0)
        return numar;
      return -numar;
    }
}
