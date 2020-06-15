import { Component } from '@angular/core';
import { AngularFirestore, DocumentData, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  formCollection : AngularFirestoreCollection
  formCollectionData : Observable<DocumentData>;
  forms : DocumentData[];
  formsID : Observable<DocumentData>;
  formsIdData : string[];

  constructor(private afstore: AngularFirestore, private router : Router) {
    this.formCollection = afstore.collection('forms');

    this.formCollectionData = this.formCollection.snapshotChanges().pipe(
      map(action =>{
        return action.map(form =>{
          const id = form.payload.doc.id;
          const data = form.payload.doc.data();
          return{id, ...data};
        })
      })
    )
  }
  
  clickForm(id:string){
    this.router.navigate(['/isi-form',id])
  }
}
