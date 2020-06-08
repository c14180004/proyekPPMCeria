import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ""
  password: string = ""
  constructor(
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public alert: AlertController
  ) { }

  ngOnInit() {
  }
  async login(){
    const { username, password } = this
    try{
      const res = await this.afAuth.signInWithEmailAndPassword(username + "@angker.com",password);
      
      if(res.user) {
          this.user.setUser({
            username,
            uid: res.user.uid
          });
          this.router.navigate(['/tabs']);
      }

    } catch(err){
      console.dir(err)
      if(err.code === "auth/user-not-found"){
        this.presentAlert("Error!", "User not found");
      }
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