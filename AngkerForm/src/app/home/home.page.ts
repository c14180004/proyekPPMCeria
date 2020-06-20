import { Component } from '@angular/core';
import { AngularFirestore, DocumentData, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  formCollection : AngularFirestoreCollection
  formDoc : AngularFirestoreDocument;
  formCollectionData : Observable<DocumentData>;
  forms : DocumentData[];
  formsID : Observable<DocumentData>;
  formsIdData : string[];
  searchInput : string = "";
  constructor(private afstore: AngularFirestore, private router : Router,public alert: AlertController) {
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

  search(){
    if(this.searchInput != ""){
      this.formDoc = this.afstore.doc(`forms/${this.searchInput}`);
      this.formDoc.valueChanges().subscribe(action =>{
        if(action){
          this.router.navigate(['/isi-form',this.searchInput])
        }else{
          this.presentAlert("Error!", "Form code not valid");
        }
      })  
      this.searchInput = "";    
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
