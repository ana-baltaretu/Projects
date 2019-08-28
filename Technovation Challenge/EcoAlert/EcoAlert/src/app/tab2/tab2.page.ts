import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'Firebase';
import { Router } from '@angular/router'
import { User } from '../users/user';
import { AngularFireAuth } from '@angular/fire/auth'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { Event } from '../events/event';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { map } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  myId = null;
  public items = [];
  public name = null;
  public email = null;
  public base64Image: string;
  public userProperties: Observable<any>;
  public eventsList: Observable<any>;
  
  npassword: string;
  cnpassword: string;

  ref = firebase.database().ref('/users/');
  userSub;

  constructor(
      private activatedRoute: ActivatedRoute,
      public afd: AngularFireDatabase,
      private afAuth: AngularFireAuth,
      public router: Router,
      public webview: WebView,
      public platform: Platform,
      private actionSheetController: ActionSheetController,
      private photoLibrary: PhotoLibrary,
      public alert: AlertController,
      public camera: Camera
    ) {
      this.userSub = this.afAuth.authState.subscribe(user =>{
        if(user) {
          this.myId = user.uid;  
          this.eventsList = this.afd.list('/users/' + this.myId + '/eventsList').valueChanges();
          console.log(this.myId);
          this.userProperties = this.afd.list('/users/' + this.myId).valueChanges();
          let UserRef = this.ref.child(this.myId);
            this.userProperties.subscribe(
            data => {
              this.items = data;
              console.log(this.items);
               this.base64Image = this.items[6];
            }
          )
         
          console.log(this.base64Image);
          UserRef.set({
            id: this.items[5],
            username: this.items[8],
            email: this.items[0],
            eventsList: this.items[1],
            homeLat: this.items[2],
            homeLng: this.items[3],
            radius: this.items[7],
            homeLocationSet: this.items[4],
            photo: this.base64Image
           
          });
        
        }
      });
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

	async changePassword(npassword, cnpassword: string)
	{
		this.userSub = this.afAuth.authState.subscribe(user =>{
        if(user) {
			if(npassword == cnpassword)
			{
				//this.authService.passwordChangeUser(npassword);
				user.updatePassword(npassword).then(() => this.router.navigateByUrl('/tabs/tab1'));
				this.showAlert("Succes!", "Password changed!");
			}
			else
			{
				this.showAlert("Error","Passwords don't match!");
			}
		}})
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
    header,
    message,
    buttons: ["Ok"]
  })
  await alert.present()
  }

    logOut(){
      this.userSub.unsubscribe();
      this.afAuth.auth.signOut()
            .then(() => this.router.navigateByUrl('/login'));
    }
    ngOnInit() {
      //this.ionViewDidLoad();
    }

    async itemSelected(eventSelected: Event) {
      let eventId = eventSelected.id;
      this.router.navigate(['/event-details/' + eventId]);
    }

}
