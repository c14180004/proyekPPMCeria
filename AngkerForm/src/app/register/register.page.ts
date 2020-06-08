import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { AngularFirestore } from '@angular/fire/firestore'

import {AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string = ""
  password: string = ""
  cpassword: string = ""

  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async register(){
    const { username, password, cpassword } = this;
    if(password !== cpassword){
      this.presentAlert("Error!", "Passwords don't match");
      return console.error("Passwords don't match");
    }
    
    try{
      const res = await this.afAuth.createUserWithEmailAndPassword(username + "@angker.com",password)
      
      this.afstore.doc(`users/${res.user.uid}`).set({
        username
      });

      this.user.setUser({
        username,
        uid: res.user.uid
      });

      this.presentAlert("Success!", "Account has been registered.");
      this.router.navigate(['/tabs']);

    } catch(error){
      console.dir(error);
      this.presentAlert("Error!", error.message);
    }
    
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })

    await alert.present();
  }

}
