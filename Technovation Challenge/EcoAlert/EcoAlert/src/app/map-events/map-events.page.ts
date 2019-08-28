///IMPORTS
///ANGULAR
import { Component , OnInit} from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
///FIREBASE
import * as firebase from 'Firebase';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Event } from '../events/event';
///ROUTING
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router'
///GOOGLE MAPS
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker,
  MarkerOptions,
  GoogleMapsAnimation,
  MyLocation,
  CameraPosition
} from "@ionic-native/google-maps";
import { analyzeAndValidateNgModules } from '@angular/compiler';
///OTHER
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map-events',
  templateUrl: './map-events.page.html',
  styleUrls: ['./map-events.page.scss'],
})

export class MapEventsPage implements OnInit {

  items;
  geoLocationLat: any;
  geoLocationLng: any;
  eventData = [];
  map: GoogleMap;
  loading: any;
  public eventsList: Observable<any>;

  constructor(
    public loadingController: LoadingController,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afd: AngularFireDatabase,
    private platform: Platform,

    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.eventsList = this.afd.list('events').valueChanges();

   }

  ///INITIALIZE
  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  /// LOAD THE MAP
  loadMap() {

    /// Create map
    this.map = GoogleMaps.create('map_canvas');

    /// Go to my location
    this.onButtonClick();
  }

  async onButtonClick() {

    /// Clear map of all the markers
    this.map.clear();

    /// Display loading notification
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    /// Get the location
    this.getLocation();

    /// Get marker info

    /// Add marker + data
    this.addCluster();
  }

  async getLocation(){

    // Get my current location
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
        zoom: 18,
        duration: 1200,
      });

      ///Dismiss loading notification
      this.loading.dismiss();
    });
  }

  ///ADD THE MARKERS
  addCluster()
  {

    this.eventsList.subscribe(
      data => {
        this.items = data;
        console.log(this.items);
        for(var i = 0; i < this.items.length; i++)
          this.placeMarker(
            this.items[i].geoLocationLat, //category
            this.items[i].geoLocationLng, //latitute,
            this.items[i].category, //long);
            this.items[i].id); 
      }
    );


  }

  placeMarker(eventLat: any, eventLng: any, eventCategory: any, eventId: any)
  {
    console.log(eventLat);
    console.log(eventLng);
    console.log(eventCategory);
    console.log(eventId);
    console.log("     ");
    let markerIcon: any;

    if (eventCategory == "bikeMarker") ///BIKE
      markerIcon = "assets/icon/bikeMarker.png";
    else if (eventCategory == "bottleMarker")///BOTTLE
      markerIcon = "assets/icon/bottleMarker.png";
    else if (eventCategory == "treeMarker")//TREE
      markerIcon = "assets/icon/treeMarker.png";
    else if (eventCategory == "waterMarker")///WATER
      markerIcon = "assets/icon/waterMarker.png";
    else ///DEFAULT
      markerIcon = "assets/icon/otherMarker.png";

    this.map.addMarker({
      position: {
        lat: eventLat,
        lng: eventLng
      },
      icon: markerIcon
    }).then((marker: Marker) => {

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.router.navigate(['/event-details/' + eventId]);
      });
    });
  }

 goBack()
 {
   ///WHEN YOU PRESS BACK BUTTON --WEIRD INTERACTION
   this.router.navigate(['tab1']);
 }
}

