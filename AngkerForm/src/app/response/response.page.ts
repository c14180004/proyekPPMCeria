import { Component, OnInit } from '@angular/core';
import { DocumentData, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
      })
      
    })
    
  }

}
