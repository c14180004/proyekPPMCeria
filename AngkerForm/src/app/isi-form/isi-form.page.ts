import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { partitionArray } from '@angular/compiler/src/util';
import { AngularFirestoreDocument, DocumentData, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { FormBox } from '../formBox.model';
import { throwIfEmpty } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-isi-form',
  templateUrl: './isi-form.page.html',
  styleUrls: ['./isi-form.page.scss'],
})
export class IsiFormPage implements OnInit {
  formID : string;
  formDoc : AngularFirestoreDocument;
  formDocData : Observable<DocumentData>;
  form : DocumentData;
  formData : any[];

  answerID : string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController
  ) {
  }

  ngOnInit() {
    this.formData = []
  }
  ionViewWillEnter(){
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('formID')){
        return
      }
      this.formID = paramMap.get('formID');
      this.formDoc = this.afstore.doc(`forms/${this.formID}`);
      this.formDocData = this.formDoc.valueChanges();
      this.formDocData.subscribe(formList =>{
        this.form = formList;
        this.formData = []
        for(var i = 0;i<this.form.formList.length;i++){
          this.formData.push({formType: this.form.formList[i].formType, question: this.form.formList[i].formQuestion,value: []});
        }
        console.log(this.formData);
      })
      
      this.answerID = this.formID + "-" + this.user.getUsername();
      this.afstore.firestore.doc(`responses/${this.answerID}`).get().then(
        docSnapshot => {
          if (docSnapshot.exists) {
            this.presentAlert("You have already responded to this form!", "Submitting another response will replace your previous response.");
          }
        }
      );

    })
  }

  submit(){
    const formData = this.formData;

    this.afstore.doc(`forms/${this.formID}`).update({
      formResponses: firestore.FieldValue.arrayUnion(this.answerID)
    })
    this.afstore.doc(`responses/${this.answerID}`).set({
      formData,
      respondent: this.user.getUsername()
    })

    this.presentAlert("Success!", "Your response has been submitted.");

    this.router.navigate(['/tabs/home']);
  }

  radioAnswer(index,event) {
    // console.log(event.detail.value);
    this.formData[index].value= event.detail.value
  }

  checkboxAnswer(index,event){
    var cbAnswer = this.formData[index].value;
    if(!cbAnswer.includes(event.detail.value)){
      cbAnswer.push(event.detail.value)
    }else{
      var cbAnswerI = cbAnswer.indexOf(event.detail.value);
      cbAnswer.splice(cbAnswerI,1)
    }
    console.log(this.formData[index].value)
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
