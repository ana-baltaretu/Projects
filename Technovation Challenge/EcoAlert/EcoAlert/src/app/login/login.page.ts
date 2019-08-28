import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AlertController} from '@ionic/angular'
import { Router } from '@angular/router'
import { auth } from 'firebase/app'
import { User } from '../users/user';

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  username: string = ""
  password: string = ""
  user = {} as User;
  public id;
  constructor(public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }
  
  //acdefg + @gmail or @codename.com
  async login(user: User) {
    try {
        //kind of a 
        this.showAlert("Success!", "Welcome")
        
        const res = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        var user2 = firebase.auth().currentUser;
        this.id = user2.uid;
        this.router.navigate(['/tabs/tab1/'])
    } catch(err) {

          console.dir(err)
          this.showAlert("Could not log in", "ERROR")
          if(err.code === "auth/user-not-found"){
            console.log("user not found")
          }
    }
  }

  /*ngAfterViewInit(){
    //this.nav is now defined
    setTimeout(() => {
      this.nav.push(SomeOtherPage);
    }, 2000);
  }*/
  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
    header,
    message,
    buttons: ["Ok"]
  })
  await alert.present()
  }
}
