import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, DocumentData, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
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

  constructor(
    private route: ActivatedRoute,
    private afstore: AngularFirestore,
    public user: UserService
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
        console.log(this.formData); //Di sini bisa
      })
      
    })
    
    console.log(this.formData); //Di sini sudah hilang
  }

}
