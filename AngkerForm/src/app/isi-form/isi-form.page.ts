import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { partitionArray } from '@angular/compiler/src/util';
import { AngularFirestoreDocument, DocumentData, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  constructor(
    private route:ActivatedRoute,
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
      this.formDocData.subscribe(formData =>{
        this.form = formData;
      })
    })
  }
  submit(){
    
  }

}
