import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentData } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { FormBox } from '../formBox.model';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  userDoc : AngularFirestoreDocument;
  userDocData : Observable<DocumentData>;
  userFormCodes : string[];

  userFormDoc : AngularFirestoreDocument[];
  userFormDocData : Observable<DocumentData>[];
  userForms : DocumentData[];

  constructor(private afstore: AngularFirestore, private user: UserService) { 
    this.userDoc = afstore.doc(`users/${this.user.getUID()}`);

    this.userDocData = this.userDoc.valueChanges();

    this.userDocData.subscribe(user => {
      this.userFormCodes = user.forms;

      this.userFormDoc = [];
      this.userFormDocData = [];
      this.userForms = [];

      for (let i = 0; i < this.userFormCodes.length; i++) {
        this.userFormDoc[i] = afstore.doc(`forms/${this.userFormCodes[i]}`);
        this.userFormDocData[i] = this.userFormDoc[i].valueChanges();
  
        this.userFormDocData[i].subscribe(form => {
          this.userForms[i] = form;
        })
      }

    })

  }

  ngOnInit() {
  }

}
