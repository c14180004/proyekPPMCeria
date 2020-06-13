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
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  cpasswordType: string = 'password';
  cpasswordIcon: string = 'eye-off';
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
    const formAi = 1;
    if(password !== cpassword){
      this.presentAlert("Error!", "Passwords don't match");
      return console.error("Passwords don't match");
    }
    
    try{
      const res = await this.afAuth.createUserWithEmailAndPassword(username + "@angker.com",password)
      this.afstore.doc(`users/${res.user.uid}`).set({
        username,
        formAi
      });

      this.user.setUser({
        username,
        uid: res.user.uid,
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

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowCPassword() {
    this.cpasswordType = this.cpasswordType === 'text' ? 'password' : 'text';
    this.cpasswordIcon = this.cpasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
