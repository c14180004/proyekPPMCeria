import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestoreDocument, DocumentData, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { FormModel } from '../formModel.model';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

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

  preview: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public storage: AngularFireStorage
  ) {
    
  }

  ngOnInit() {
    this.preview = false;
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

  switchPreview(){
    if(this.preview){
      this.preview = false;
    }else{
      this.preview = true;
    }
  }

  clickResponse(id:string){
    this.router.navigate(['/response',id])
  }

  deleteForm(){
    //Delete form responses
    for (let i = 0; i < this.formData.formResponses.length; i++){
      this.afstore.doc(`responses/${this.formData.formResponses[i]}`).delete();
    }

    //Delete images in the form
    for (let i = 0; i < this.formData.formList.length; i++) {
      
      if(this.formData.formList[i].formType == "Image"){
        const fileRef = this.storage.ref(this.formData.formList[i].formValue[0]);
        try{
          fileRef.delete();
          console.log("delete Image success");
        }catch{
          console.log("delete Image failed")
        }
        
      }
      else
      {
        continue;
      }

    }

    //Delete form document
    this.afstore.doc(`forms/${this.formID}`).delete();

    //Remove from User's form list
    this.afstore.doc(`users/${this.user.getUID()}`).update({
      forms: firestore.FieldValue.arrayRemove(this.formID)
    })

    this.presentAlert("Success!", "Form has been deleted.");
    
    this.router.navigate(['/tabs/forms']);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })

    await alert.present();
  }

  async presentAlertDelete() {
    const alert = await this.alert.create({
      header: 'Are you sure?',
      message: 'Deleted forms cannot be recovered!',
      buttons: [
        "Cancel",
        {
          text: 'Delete',
          handler: () => {
            this.deleteForm();
          }
        }
      ]
    });

    await alert.present();
  }

}
