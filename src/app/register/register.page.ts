import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
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
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }
  async register(){
    const { username, password, cpassword } = this
    if(password !== cpassword){
      return console.error("passwords dont't match ")
    }
    console.log(username);
    try{
      const res = await this.afAuth.createUserWithEmailAndPassword(username + "@angker.com",password)
      console.log(res)
    } catch(error){
      console.dir(error)
    }
    
  }
}
