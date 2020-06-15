import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  username: string;
  showCP: boolean;
  newPassword: string;
  cNewPassword: string;
  password: string;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  newPasswordType: string = 'password';
  newPasswordIcon: string = 'eye-off';
  cNewPasswordType: string = 'password';
  cNewPasswordIcon: string = 'eye-off';
  constructor(
    public afAuth: AngularFireAuth,
    private afstore: AngularFirestore,
    public user: UserService,
    public router: Router,
    public alert: AlertController
  ) { 
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.username = this.user.getUsername();
    this.showCP = false;
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['../login']);
  }

  showChangePassword(){
    if(this.showCP){
      this.password = ""
      this.newPassword = ""
      this.cNewPassword = ""
      this.showCP = false;
    }else{
      this.showCP = true;
    }
  }
  
  async changePassword(){
    if(this.newPassword !== this.cNewPassword){
      this.presentAlert("Error!", "New passwords don't match");
      return console.error("New passwords don't match");
    }
    if(!this.password){
      return this.presentAlert('Error!', 'You have to enter a password')
    }
    try{
      await this.user.reAuth(this.user.getUsername(),this.password)
    }catch{
      return this.presentAlert('Error!','Wrong Password')
    }
    if(this.newPassword){
      try{
        await this.user.updatePassword(this.newPassword)
        this.presentAlert("Success!","your password has been changed!")
      } catch(error){
        this.presentAlert("Error!", error.message);
      }
    }
    this.password = ""
    this.newPassword = ""
    this.cNewPassword = ""
    this.showCP = false;
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
  hideShowNewPassword() {
    this.newPasswordType = this.newPasswordType === 'text' ? 'password' : 'text';
    this.newPasswordIcon = this.newPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowCNewPassword() {
    this.cNewPasswordType = this.cNewPasswordType === 'text' ? 'password' : 'text';
    this.cNewPasswordIcon = this.cNewPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
