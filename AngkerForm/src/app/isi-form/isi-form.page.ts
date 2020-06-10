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
  constructor(
    private route:ActivatedRoute,
    private afstore: AngularFirestore,
    public user: UserService
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
          this.formData.push({formType: this.form.formList[i].formType, question: this.form.formList[i].formQuestion,value: [""]});
        }
        console.log(this.formData);
      })
      
    })
  }
  submit(){
    const answerId = this.formID + this.user.getUsername();
    const formData = this.formData;
    this.afstore.doc(`forms/${this.formID}`).update({
      formAnswers: firestore.FieldValue.arrayUnion(answerId)
    })
    this.afstore.doc(`answers/${answerId}`).set({
      formData
    })
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

}
