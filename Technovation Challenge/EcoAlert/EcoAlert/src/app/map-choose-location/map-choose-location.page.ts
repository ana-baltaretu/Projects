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


@Component({
  selector: 'app-map-choose-location',
  templateUrl: './map-choose-location.page.html',
  styleUrls: ['./map-choose-location.page.scss'],
})
export class MapChooseLocationPage implements OnInit {

  ///VARIABLES
  markerIcon: any;
  map: GoogleMap;
  loading: any;
  event = {} as Event;
  mapCenterIcon: any;
  myId = null;
  address: string;

  ///RECIEVED AND SENT VARIABLES
  name: string;
  category: any;
  date: string;
  startHour: string;
  description: string;
  geoLocationLat: any;
  geoLocationLng: any;

  constructor(
    public loadingController: LoadingController,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afd: AngularFireDatabase,
    private platform: Platform,

    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state)
      {
        ///GET DATA FROM Tabs4
        this.name = this.router.getCurrentNavigation().extras.state.name;
        this.category = this.router.getCurrentNavigation().extras.state.category;
        this.mapCenterIcon = this.router.getCurrentNavigation().extras.state.category;
        this.date = this.router.getCurrentNavigation().extras.state.date;
        this.startHour = this.router.getCurrentNavigation().extras.state.startHour;
        this.description = this.router.getCurrentNavigation().extras.state.description;
      }
    })
  }
  //ref = firebase.database().ref('/events/' + this.myId);

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

    /// Add marker + data
    this.addCluster(this.dummyData());
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


  addMarker()
    {
      if(this.mapCenterIcon != "blank")///DACA NU S-O PUS ALT MARKER
      {
        if (this.category == "bikeMarker") ///BIKE
          this.markerIcon = "assets/icon/bikeMarker.png";
        else if (this.category == "bottleMarker")///BOTTLE
          this.markerIcon = "assets/icon/bottleMarker.png";
        else if (this.category == "treeMarker")//TREE
          this.markerIcon = "assets/icon/treeMarker.png";
        else if (this.category == "waterMarker")///WATER
          this.markerIcon = "assets/icon/waterMarker.png";
        else ///DEFAULT
          this.markerIcon = "assets/icon/otherMarker.png";

        ///DISABLE EVERYTHING --NOT DONE
        this.mapCenterIcon = "blank";

        ///PLACE MARKER
        var target = this.map.getCameraTarget();
        this.geoLocationLat = target.lat;
        this.geoLocationLng = target.lng;

        this.map.addMarker({
            position: {
              lat: this.geoLocationLat,
              lng: this.geoLocationLng
            },
            icon: this.markerIcon
          });
      }

    }

  ///ADD THE MARKERS
  addCluster(data) {
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/icon/treeMarkerIconSmall.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/icon/treeMarkerIconSmall.png",
          label: {
            color: "white"
          }
        }
      ]
    });

    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      let marker: Marker = params[1];
      marker.setTitle(marker.get("name"));
      marker.setSnippet(marker.get("address"));
      marker.showInfoWindow();
    });

  }

  goBack()
  {
    ///WHEN YOU PRESS BACK BUTTON --WEIRD INTERACTION
    this.router.navigate(['tab4']);
  }

  confirmLocation()
  {
    ///SEND DATA TO Create-Event Page
    let navigationExtras: NavigationExtras =
      {
        state: {
          name: this.name,
          category: this.category,
          date: this.date,
          startHour: this.startHour,
          description: this.description,
          geoLocationLat: this.geoLocationLat,
          geoLocationLng: this.geoLocationLng
        }
      }
    this.router.navigate(['create-event'], navigationExtras); ///WITH ALL THE VARIABLES
  }


  dummyData() {
    ///MARKER DATA IN A DISTANT PART OF THE WORLD
    return [
      {
        "position": {
          "lat": 21.382314,
          "lng": -157.933097
        },
        "name": "Starbucks - HI - Aiea  03641",
        "address": "Aiea Shopping Center_99-115\nAiea Heights Drive #125_Aiea, Hawaii 96701",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3871,
          "lng": -157.9482
        },
        "name": "Starbucks - HI - Aiea  03642",
        "address": "Pearlridge Center_98-125\nKaonohi Street_Aiea, Hawaii 96701",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.363402,
          "lng": -157.928275
        },
        "name": "Starbucks - HI - Aiea  03643",
        "address": "Stadium Marketplace_4561\nSalt Lake Boulevard_Aiea, Hawaii 96818",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3884,
          "lng": -157.9431
        },
        "name": "Starbucks - HI - Aiea  03644",
        "address": "Pearlridge Mall_98-1005\nMoanalua Road_Aiea, Hawaii 96701",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.6507,
          "lng": -158.0652
        },
        "name": "Starbucks - HI - Haleiwa  03645",
        "address": "Pupukea_59-720 Kamehameha Highway\nHaleiwa, Hawaii 96712",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.699335,
          "lng": -155.06566
        },
        "name": "Starbucks - HI - Hilo  03646",
        "address": "Border Waiakea Center_315-325\nMakaala Street_Hilo, Hawaii 96720",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.698399,
          "lng": -155.064864
        },
        "name": "Starbucks - HI - Hilo  03647",
        "address": "Prince Kuhio Plaza_111\nEast Puainako Street_Hilo, Hawaii 96720",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.722763,
          "lng": -155.085598
        },
        "name": "Starbucks - HI - Hilo [D]  03648",
        "address": "Hilo_438 Kilauea Ave_Hilo, Hawaii 96720",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.338183,
          "lng": -157.917579
        },
        "name": "Starbucks - HI - Honolulu  03649",
        "address": "Airport Trade Center_550\nPaiea Street_Honolulu, Hawaii 96819",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3074,
          "lng": -157.865199
        },
        "name": "Starbucks - HI - Honolulu  03650",
        "address": "Aloha Tower_1 Aloha Tower Drive\nHonolulu, Hawaii 96813",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.30846253,
          "lng": -157.8614898
        },
        "name": "Starbucks - HI - Honolulu  03651",
        "address": "Bishop_1000 Bishop Street #104\nHonolulu, Hawaii 96813",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.311363,
          "lng": -157.863751
        },
        "name": "Starbucks - HI - Honolulu  03652",
        "address": "Central Pacific Bank_220 South King Street\nHonolulu, Hawaii 96813",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.28507546,
          "lng": -157.838214
        },
        "name": "Starbucks - HI - Honolulu  03653",
        "address": "Discovery Bay_1778 Ala Moana Boulevard\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.342733,
          "lng": -158.027408
        },
        "name": "Starbucks - HI - Honolulu  03654",
        "address": "Ewa Beach_91-1401 Fort Weaver Road\nHonolulu, Hawaii 96706",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.28005068,
          "lng": -157.8285093
        },
        "name": "Starbucks - HI - Honolulu  03655",
        "address": "Duty Free Shopper_330 Royal Hawaiian Avenue\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3115,
          "lng": -157.8649
        },
        "name": "Starbucks - HI - Honolulu  03656",
        "address": "Financial Plaza_130 Merchant Street #111\nHonolulu, Hawaii 96813",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.282048,
          "lng": -157.713041
        },
        "name": "Starbucks - HI - Honolulu  03657",
        "address": "Hawaii Kai Town Center_6700\nKalanianaole Highway_Honolulu, Hawaii 96825",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.291345,
          "lng": -157.848791
        },
        "name": "Starbucks - HI - Honolulu  03658",
        "address": "Hokua_1288 Ala Moana Blvd\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.335164,
          "lng": -157.868742
        },
        "name": "Starbucks - HI - Honolulu  03659",
        "address": "Kamehameha Shopping Center_1620 North School Street\nHonolulu, Hawaii 96817",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.27852422,
          "lng": -157.7875773
        },
        "name": "Starbucks - HI - Honolulu  03660",
        "address": "Kahala Mall_4211 Waialae Avenue\nHonolulu, Hawaii 96816",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.294372,
          "lng": -157.841963
        },
        "name": "Starbucks - HI - Honolulu  03661",
        "address": "Keeaumoku_678 Keeamoku Street #106\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.2819,
          "lng": -157.8163
        },
        "name": "Starbucks - HI - Honolulu  03662",
        "address": "Kapahulu Avenue_625 Kapahulu Avenue\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.27608195,
          "lng": -157.7049835
        },
        "name": "Starbucks - HI - Honolulu  03663",
        "address": "Koko Marina_7192 Kalanianaole Highway\nHonolulu, Hawaii 96825",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3129,
          "lng": -157.8129
        },
        "name": "Starbucks - HI - Honolulu  03664",
        "address": "Manoa Valley_2902 East Manoa Road\nHonolulu, Hawaii 96822",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.293082,
          "lng": -157.847092
        },
        "name": "Starbucks - HI - Honolulu  03665",
        "address": "Macys Ala Moana_1450 Ala Moan Boulevard\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.341957,
          "lng": -157.929089
        },
        "name": "Starbucks - HI - Honolulu  03666",
        "address": "Moanalua Shopping Center_930 Valkenburgh Street\nHonolulu, Hawaii 96818",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.279503,
          "lng": -157.833101
        },
        "name": "Starbucks - HI - Honolulu  03667",
        "address": "Outrigger Reef_2169 Kalia Road #102\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.282251,
          "lng": -157.828172
        },
        "name": "Starbucks - HI - Honolulu  03668",
        "address": "Ohana Waikiki West_2330 Kuhio Avenue\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.323602,
          "lng": -157.890904
        },
        "name": "Starbucks - HI - Honolulu  03669",
        "address": "Sand Island_120 Sand Island Access Road #4\nHonolulu, Hawaii 96819",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.270016,
          "lng": -157.82381
        },
        "name": "Starbucks - HI - Honolulu  03670",
        "address": "Park Shore Hotel_2856 Kalakaua Avenue\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.289497,
          "lng": -157.842832
        },
        "name": "Starbucks - HI - Honolulu  03671",
        "address": "Sears Ala Moana Center_1450 Ala Moana Blvd.\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.28201,
          "lng": -157.831087
        },
        "name": "Starbucks - HI - Honolulu  03672",
        "address": "Waikiki Shopping Plaza_2270 Kalakaua Avenue #1800\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.2833,
          "lng": -157.8298
        },
        "name": "Starbucks - HI - Honolulu  03673",
        "address": "Waikiki Trade Center_2255 Kuhio Avenue S-1\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.297,
          "lng": -157.8555
        },
        "name": "Starbucks - HI - Honolulu  03674",
        "address": "Ward Entertainment Center_310 Kamakee Street #6\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.406095,
          "lng": -157.800761
        },
        "name": "Starbucks - HI - Honolulu  03675",
        "address": "Windward City Shopping Center_45-480 Kaneohe Bay Drive\nHonolulu, Hawaii 96744",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.2829,
          "lng": -157.8318
        },
        "name": "Starbucks - HI - Honolulu  03676",
        "address": "Waikiki Walk_2222 Kalakaua Avenue\nHonolulu, Hawaii 96815",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.293045,
          "lng": -157.852223
        },
        "name": "Starbucks - HI - Honolulu  03677",
        "address": "Ward Gateway_1142 Auahi Street\nHonolulu, Hawaii 96814",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.3067,
          "lng": -157.858444
        },
        "name": "Starbucks - HI - Honolulu [A]  03678",
        "address": "HNL Honolulu Airport_300 Rogers Blvd\nHonolulu, Hawaii 96820",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.891963,
          "lng": -156.477614
        },
        "name": "Starbucks - HI - Kahului  03679",
        "address": "Queen Kaahumanu Center_275 West Kaahuman Avenue #1200 F5\nKahului, Hawaii 96732",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.8843,
          "lng": -156.4583
        },
        "name": "Starbucks - HI - Kahului  03680",
        "address": "Maui Marketplace_270 Dairy Road\nKahului, Hawaii 96732",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.39356972,
          "lng": -157.7403334
        },
        "name": "Starbucks - HI - Kailua  03681",
        "address": "Kailua Village_539 Kailua Road\nKailua, Hawaii 96734",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.6512,
          "lng": -155.9944
        },
        "name": "Starbucks - HI - Kailua-Kona  03682",
        "address": "Kona Coast Shopping Center_74-5588 Palani Road\nKailua-Kona, Hawaii 96740",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.8434,
          "lng": -155.7652
        },
        "name": "Starbucks - HI - Kamuela  03683",
        "address": "Parker Ranch Center_67-1185 Mamalahoa Highway D108\nKamuela, Hawaii 96743",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.34306,
          "lng": -158.078906
        },
        "name": "Starbucks - HI - Kapolei  03684",
        "address": "Halekuai Center_563 Farrington Highway #101\nKapolei, Hawaii 96707",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.336,
          "lng": -158.0802
        },
        "name": "Starbucks - HI - Kapolei [D]  03685",
        "address": "Kapolei Parkway_338 Kamokila Boulevard #108\nKapolei, Hawaii 96797",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.740343,
          "lng": -156.456218
        },
        "name": "Starbucks - HI - Kihei  03686",
        "address": "Kukui Mall_1819 South Kihei Road\nKihei, Hawaii 96738",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.7575,
          "lng": -156.4559
        },
        "name": "Starbucks - HI - Kihei  03687",
        "address": "Piilani Village Shopping Center_247 Piikea Avenue #106\nKihei, Hawaii 96753",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 19.9338,
          "lng": -155.8422
        },
        "name": "Starbucks - HI - Kohala Coast  03688",
        "address": "Mauna Lani_68-1330 Mauna Lani Drive H-101b\nKohala Coast, Hawaii 96743",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.886244,
          "lng": -156.684697
        },
        "name": "Starbucks - HI - Lahaina  03689",
        "address": "Lahaina Cannery Mall_1221 Honoapiilani Highway\nLahaina, Hawaii 96761",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.8804,
          "lng": -156.6816
        },
        "name": "Starbucks - HI - Lahaina  03690",
        "address": "Lahaina_845 Wainee Street\nLahaina, Hawaii 96761",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.970661,
          "lng": -159.396274
        },
        "name": "Starbucks - HI - Lihue  03691",
        "address": "Kukui Grove_3-2600 Kaumualii Highway #A8\nLihue, Hawaii 96766",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.8818,
          "lng": -156.4633
        },
        "name": "Starbucks - HI - Maui [A]  03692",
        "address": "OGG Kahului Main Concourse_New Terminal Bldg @ Bldg 340\nMaui, Hawaii 96732",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.4585,
          "lng": -158.0178
        },
        "name": "Starbucks - HI - Mililani  03693",
        "address": "Mililani Shopping Center_95-221 Kipapa Drive\nMililani, Hawaii 96789",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.474341,
          "lng": -158.001864
        },
        "name": "Starbucks - HI - Mililani  03694",
        "address": "Mililani Town Center_95-1249 Meheula Parkway\nMililani, Hawaii 96789",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 20.838965,
          "lng": -156.34192
        },
        "name": "Starbucks - HI - Pukalani  03695",
        "address": "Pukalani Foodland_55 Pukalani Street\nPukalani, Hawaii 96768",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.378675,
          "lng": -157.728499
        },
        "name": "Starbucks - HI - Waipahu  03696",
        "address": "Enchanted Lakes_1020 Keolu Drive\nWaipahu, Hawaii 96734",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.39662113,
          "lng": -158.0317397
        },
        "name": "Starbucks - HI - Waipahu  03697",
        "address": "Kunia Shopping Center_94-673 Kupuohi Street\nWaipahu, Hawaii 96797",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      },
      {
        "position": {
          "lat": 21.403688,
          "lng": -158.006128
        },
        "name": "Starbucks - HI - Waipahu  03698",
        "address": "Waikele_94-799 Lumiaina Street\nWaipahu, Hawaii 96797",
        "icon": "assets/icon/treeMarkerIconSmall.png"
      }
    ];
  }

  

  ///END
}
