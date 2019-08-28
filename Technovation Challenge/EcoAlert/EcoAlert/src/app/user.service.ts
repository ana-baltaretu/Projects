import { User } from './users/user';
import { Injectable } from '../../node_modules/@angular/core';

import { AngularFireAuth } from '@angular/fire/auth'

@Injectable() 
export class UserService {
    private user = {} as User;

    constructor(private afAuth: AngularFireAuth) {

    }


    setUser(user: User) {
        this.user = user;
    }

    getUid() {
        /*if(!this.user) {
            if(this.afAuth.auth.currentUser) {
                const user = this.afAuth.auth.currentUser
                this.setUser({
                    id: user.uid,
                    email: user.email
                })
            }
        }*/
        return this.user.id;
    }
}