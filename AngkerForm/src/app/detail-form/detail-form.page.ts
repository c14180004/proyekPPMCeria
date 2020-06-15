import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestoreDocument, DocumentData, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormModel } from '../formModel.model';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.page.html',
  styleUrls: ['./detail-form.page.scss'],
})
export class DetailFormPage implements OnInit {

  formID : string;
  formDoc : AngularFirestoreDocument<FormModel>;
  formDocData : Observable<FormModel>;

  formData : FormModel;

  responseDoc : AngularFirestoreDocument[];
  responseDocData : Observable<DocumentData>[];

  responseData : DocumentData[];
  responses : string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afstore: AngularFirestore
  ) {

  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('formID')){
        return
      }
      this.formID = paramMap.get('formID');

      this.formDoc = this.afstore.doc(`forms/${this.formID}`);
      this.formDocData = this.formDoc.valueChanges();
      this.formDocData.subscribe(form => {
        this.formData = form;

        this.responseDoc = [];
        this.responseDocData = [];
        this.responseData = [];
        this.responses = this.formData.formResponses;

        for (let i = 0; i < this.formData.formResponses.length; i++) {
          this.responseDoc[i] = this.afstore.doc(`responses/${this.formData.formResponses[i]}`);
          this.responseDocData[i] = this.responseDoc[i].valueChanges();
    
          this.responseDocData[i].subscribe(response => {
            this.responseData[i] = response;
          })
        }

      })
      
    })
    
  }

  clickResponse(id:string){
    this.router.navigate(['/response',id])
  }

}
