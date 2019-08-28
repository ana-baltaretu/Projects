import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import * as firebase from 'Firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { 
  GoogleMap, 
  Marker, 
  Circle, 
  GoogleMaps,
  MyLocation,
  ILatLng} 
  from '@ionic-native/google-maps';

import { 
  LoadingController, 
  ToastController, 
  Platform, 
  AlertController} 
  from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notifications-range',
  templateUrl: './notifications-range.page.html',
  styleUrls: ['./notifications-range.page.scss'],
})
export class NotificationsRangePage implements OnInit {

  geoLocationLat: any;
  geoLocationLng: any;
  range: any;
  map: GoogleMap;
  loading: any;
  circle: Circle;
  markerOnMap: any;
  homeMarker: Marker;
  homeMarkerText: any;
  myId = null;
  public items = [];
  ref = firebase.database().ref('/users/');
  
  public userProperties: Observable<any>;


  constructor(public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    public alert: AlertController,
    public router: Router,
    public afd: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute
    ) { 
      //console.log("entered page");


      this.afAuth.authState.subscribe(user =>{
        if(user) {
          this.myId = user.uid;  
          //console.log(this.myId);
          this.userProperties = this.afd.list('users/' + this.myId).valueChanges();
          this.userProperties.subscribe(
            data => {
              this.items = data;
              //console.log(this.items);
            }
          )
        }
      });


      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state)
        {
          ///GET DATA FROM Tabs4
          this.markerOnMap = this.router.getCurrentNavigation().extras.state.markerOnMap;
          this.range = this.router.getCurrentNavigation().extras.state.range;
          this.geoLocationLat = this.router.getCurrentNavigation().extras.state.geoLocationLat;
          this.geoLocationLng = this.router.getCurrentNavigation().extras.state.geoLocationLng;
        }
      })

      

    }

  ///INITIALIZE
  async ngOnInit() {
    this.homeMarkerText = "Drop Home Marker";
    //this.markerOnMap = 0;
    //this.range = 5;
    await this.platform.ready();
    await this.loadMap();

    if (this.markerOnMap == 1)
      {
        let center: ILatLng = {"lat": this.geoLocationLat, "lng": this.geoLocationLng};
        let radius = this.range;

        this.circle = this.map.addCircleSync({
          'center': center,
          'radius': radius,// * this.RADIUS_MULTIPLIER,
          'strokeColor' : '#1f8900',
          'strokeWidth': 5,
          'fillColor' : '#a3ff8f'
        });

        this.homeMarker = this.map.addMarkerSync({
          position: this.circle.getCenter(),
          draggable: true,
          title: "Drag me!"
        });

        this.homeMarker.bindTo("position", this.circle, "center");
        this.homeMarkerText = "Remove Home Marker";
        }

  }

  /// LOAD THE MAP
  async loadMap() {

    /// Create map
    this.map = GoogleMaps.create('map_canvas');

    /// Clear map of all the markers
    this.map.clear();

    /// Display loading notification
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    /// Get the location
    this.getLocation();
  }

  async getLocation(){

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {

      // Add a "You are here" marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'You are here!',
        ///snippet: 'This plugin is awesome!',
        position: location.latLng,
      });

      // Animate the map camera to the location
      this.map.animateCamera({
        target: location.latLng,
        zoom: 15,
        duration: 1200,
      });

      ///Dismiss loading notification
      this.loading.dismiss();
    });
  }

  setHomeMarker()
  {
    if (this.markerOnMap == 0)
    {
      var target = this.map.getCameraTarget();
      this.geoLocationLat = target.lat;
      this.geoLocationLng = target.lng;

      let center: ILatLng = {"lat": this.geoLocationLat, "lng": this.geoLocationLng};
      let radius = this.range;

      this.circle = this.map.addCircleSync({
        'center': center,
        'radius': radius,// * this.RADIUS_MULTIPLIER,
        'strokeColor' : '#1f8900',
        'strokeWidth': 5,
        'fillColor' : '#a3ff8f'
      });

      this.homeMarker = this.map.addMarkerSync({
        position: this.circle.getCenter(),
        draggable: true,
        title: "Drag me!"
      });

      this.homeMarker.bindTo("position", this.circle, "center");
      this.homeMarkerText = "Remove Home Marker";
      this.markerOnMap = 1;
    }
    else{
      this.circle.remove();
      this.homeMarker.remove();
      this.homeMarkerText = "Drop Home Marker";
      this.markerOnMap = 0;
    }

  }

  radiusChanged()
  {
    //console.log("radius changed");
    this.circle.setRadius(this.range);//this.RADIUS_MULTIPLIER);
  }

  confirmNotificationsRange()
  {
    ///AICI SALVEZI IN DATABASE
    this.afAuth.authState.subscribe(user =>{
      if(user) {
        this.myId = user.uid;  
        //console.log(this.myId);
        let UserRef = this.ref.child(this.myId);
              
        UserRef.set({
          id: this.items[5],
          username: this.items[8],
          email: this.items[0],
          eventsList: this.items[1],
          homeLat: this.circle.getCenter().lat,
          homeLng: this.circle.getCenter().lng,
          radius: this.range,
          homeLocationSet: 1,
          photo: this.items[6],
          zNotificationsList: this.items[9]
        });
        
      }
    });
    ///[2,3]HomeLat + HomeLng = this.circle.getCenter()
    ///[4]HomeLocationSet = 1;
    ///[6]Radius = this.range * this.range
    this.showAlert("Notifications range set!", "Congratulations!");
    this.router.navigate(['/tabs/tab3']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
    header,
    message,
    buttons: ["Ok"]
  })
  await alert.present()
  }
}
