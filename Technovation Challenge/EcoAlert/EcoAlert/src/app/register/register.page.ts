import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AlertController } from '@ionic/angular'
import { Message } from '../../../node_modules/@angular/compiler/src/i18n/i18n_ast';
import { Router, ChildActivationEnd } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import { User } from '../users/user';
import { AngularFireObject } from '@angular/fire/database/interfaces';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'Firebase';


const STORAGE_KEY = 'my_images';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

      loading: boolean = true;
      data: any;
      images = [];
      username: string = ""
      password: string = ""
      cpassword: string = ""
      user = {} as User;

      infos = [];
      ref = firebase.database().ref('/users/');
      users: Array<any> = [];
      constructor(
        public afAuth: AngularFireAuth,
        public alert: AlertController,
        public router: Router, 
        private camera: Camera,
        private file: File, 
        private http: HttpClient,
        public plt: Platform,
        private webview: WebView,
        private toastController: ToastController, 
        private actionSheetController: ActionSheetController,
        private afDatabase: AngularFireDatabase
       
        ) { 
        
        }

      ngOnInit() {
          
      }
      
      
      /*loadStoredImages(){
        this.storage.get(STORAGE_KEY).then(images =>{
            if(images){
              let arr = JSON.parse(images);
              this.images = [];
              for(let img of arr){
                let filePath = this.file.dataDirectory + img;
                let resPath  = this.pathForImage(filePath);
                this.images.push({name: img, path: resPath, filePath: filePath});
              }
            }
        });
      }
     
      pathForImage(img){
        if(img == null){
          return '';
        } else {
          let converted = this.webview.convertFileSrc(img);
          return converted;
        }
      }*/
       
      /*async selectImage() {
        const actionSheet = await this.actionSheetController.create({
          header: "Select Image source",
          buttons: [{
            text: 'Load from Library',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
        });
        await actionSheet.present();
      }*/

     
      /*getImage(){
        const options: CameraOptions = {
          quality: 70, 
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum:false

        }
        this.camera.getPicture(options).then(imageData => {
          this.myPhoto = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
          //Handle Error
        });


      }
      async presentToast(text) {
        const toast = await this.toastController.create({
          message:text,
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }*/

     /* async takePhoto(){
          try {
            const options: CameraOptions = {
              quality: 50,
              targetHeight: 600,
              targetWidth: 600,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType:this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            }

            const result = await this.camera.getPicture(options)
            
            const image = 'data:image/jpeg;base64,${result}';
            const pictures = this.storage().ref('pictures');
            pictures.putString(image, 'data_url')
          
          }
          catch(e) {
            console.error(e);
          }
       }*/
      async register(user: User) {
          if(typeof(user.email) === "undefined")
            this.showAlert("Please fill in your email", "Error");
          else if(typeof(user.username) === "undefined")
            this.showAlert("Please fill in your username", "Error");
          else if(typeof(user.password) === "undefined")
            this.showAlert("Please fill in the password", "Error");
          else if(user.password !== user.cPassword){
            this.showAlert("Error", "Passwords don't match")
            return console.error("Passwords don't match")
          }
          else
            try {
              const res = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
              this.afAuth.authState.subscribe(auth => {
                    let newUserRef = this.ref.child(auth.uid);

                    newUserRef.set({
                      id: auth.uid,
                      username: user.username,
                      email: user.email,
                      eventsList: 0,
                      homeLat: 0,
                      homeLng: 0,
                      radius: 0,
                      homeLocationSet: 0,
                      photo: 'data:image/jpeg;base64,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',
                      zNotificationsList: 0
                    });
                    
              })
              console.log(res)
              this.showAlert("Success!", "Welcome")
              this.router.navigate(['/tabs'])
          } catch(error) {
              console.dir(error)
                this.showAlert("ERROR!", error.message);
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
}
