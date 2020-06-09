import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  userDoc: AngularFirestoreDocument;
  sub;
  forms;

  constructor(private afstore: AngularFirestore, private user: UserService) { 
    this.userDoc = afstore.doc(`users/${this.user.getUID()}`);
    this.sub = this.userDoc.valueChanges().subscribe(event => {
      this.forms = event.form;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
