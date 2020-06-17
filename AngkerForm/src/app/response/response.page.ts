import { Component, OnInit } from '@angular/core';
import { DocumentData, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormModel } from '../formModel.model';

@Component({
  selector: 'app-response',
  templateUrl: './response.page.html',
  styleUrls: ['./response.page.scss'],
})
export class ResponsePage implements OnInit {

  responseID : string;
  responseDoc : AngularFirestoreDocument<DocumentData>;
  responseDocData : Observable<DocumentData>;

  responseData : DocumentData;
  
  formDoc : AngularFirestoreDocument<FormModel>;
  formDocData : Observable<FormModel>;

  formData : FormModel;

  constructor(
    private route: ActivatedRoute,
    private afstore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('responseID')){
        return
      }
      this.responseID = paramMap.get('responseID');

      this.responseDoc = this.afstore.doc(`responses/${this.responseID}`);
      this.responseDocData = this.responseDoc.valueChanges();
      this.responseDocData.subscribe(response => {
        this.responseData = response;

        this.formDoc = this.afstore.doc(`forms/${this.responseData.form}`);
        this.formDocData = this.formDoc.valueChanges();

        this.formDocData.subscribe(form => {
          this.formData = form;
        })
      })
      
    })
    
  }

}
