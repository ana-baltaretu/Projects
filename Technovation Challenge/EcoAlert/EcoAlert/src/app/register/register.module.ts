import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { Message } from '../../../node_modules/@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router'

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { AlertController } from '@ionic/angular'

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
