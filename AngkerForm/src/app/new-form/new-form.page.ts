import { Component, OnInit } from '@angular/core';
import { FormBox } from '../formBox.model';
import { FormModel } from '../formModel.model';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.page.html',
  styleUrls: ['./new-form.page.scss'],
})
export class NewFormPage implements OnInit {
  formTitle: string;
  formDesc: string;
  formBox: FormBox;
  formList: FormBox[] = [];
  formType: string;
  preview: boolean;
  cekForm: boolean;
  newForm: FormModel;
  formCount: number;

  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public router : Router
  ) { }
  ngOnInit() {
    this.formCount = 0;
    this.cekForm = false;
    this.preview = false;
    this.formType = "Text"
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:["",""] ,
    }
  }
  addFormBox(){
    this.cekForm = true;
    this.formBox.formType = this.formType;
    this.formList.push(this.formBox);
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:["",""]
    }
    this.formCount = this.formCount + 1;
    console.log(this.formList);
  }
  removeFormBox(index){
    this.formList.splice(index,1);
    if(this.formList.length == 0){
      this.cekForm = false;
    }
  }
  addOption(){
    this.formBox.formValue.push("");
  }
  removeOption(){
    this.formBox.formValue.pop();
  }
  addListOption(index){
    this.formList[index].formValue.push("");
  }
  removeListOption(index){
    this.formList[index].formValue.pop();
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  switchPreview(){
    if(this.preview){
      this.preview = false;
    }else{
      this.preview = true;
    }
  }
  onChange(){
    this.formBox = {
      formType: this.formType,
      formQuestion: "",
      formValue:["",""]
    }
  }
  createForm(){
    console.log(this.user.getUFAI());
    
    const formCode = this.user.getUsername() + "_" + this.user.getUFAI();
    
    this.newForm = {
      author: this.user.getUsername(),
      formTitle: this.formTitle,
      formDesc: this.formDesc,
      formList: this.formList,
      formResponses: []
    }

    this.user.updateUFAI();
    
    this.afstore.doc(`users/${this.user.getUID()}`).update({
      forms: firestore.FieldValue.arrayUnion(formCode)
    })

    this.afstore.doc(`forms/${formCode}`).set(this.newForm)
    this.router.navigate(['./tabs/forms'])
  }
}
