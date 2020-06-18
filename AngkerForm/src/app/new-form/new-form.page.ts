import { Component, OnInit } from '@angular/core';
import { FormBox } from '../formBox.model';
import { FormModel } from '../formModel.model';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.page.html',
  styleUrls: ['./new-form.page.scss'],
})
export class NewFormPage implements OnInit {
  formTitle: string;
  formDesc: string;
  formBox: FormBox;
  formList: FormBox[] = [];
  formType: string;
  preview: boolean;
  cekForm: boolean;
  newForm: FormModel;
  formCount: number;
  //upload image
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>
  UploadedFileURL: Observable<string>
  fileName:string;
  fileSize:number;
  isUploading:boolean;
  isUploaded:boolean;
  private imageCollection: AngularFirestoreCollection<FormBox>;

  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public router: Router,
    public storage: AngularFireStorage
  ) { }
  ngOnInit() {
    this.formCount = 0;
    this.isUploading = false;
    this.isUploaded = false;
    this.cekForm = false;
    this.preview = false;
    this.formType = "Text"
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:[""]
    }
  }
  uploadFile(event: FileList){
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
     }

     this.isUploading = true;
     this.isUploaded = false;
     this.cekForm = false;
     this.fileName = file.name;
     const path = `imageStorage/${new Date().getTime()}_${file.name}`;
     const fileRef = this.storage.ref(path);
     this.task = this.storage.upload(path, file);
     this.percentage = this.task.percentageChanges();
     this.snapshot = this.task.snapshotChanges().pipe(
       
       finalize(() => {
         this.UploadedFileURL = fileRef.getDownloadURL();
         
         this.UploadedFileURL.subscribe(resp=>{
           this.addImagetoDB({
            formType: "Image",
            formQuestion: resp,
            formValue:[""]
           });
           this.isUploading = false;
           this.isUploaded = true;
           this.cekForm = true;
         },error=>{
           console.error(error);
         })
       }),
       tap(snap => {
           this.fileSize = snap.totalBytes;
       })
     )
  }

  addImagetoDB(image: FormBox) {
    this.formList.push(image);
    console.log(this.formList)
    this.onChange();
    this.formCount = this.formCount + 1;
  }
  addFormBox(){
    this.cekForm = true;
    this.formBox.formType = this.formType;
    this.formList.push(this.formBox);
    
    this.onChange();

    this.formCount = this.formCount + 1;
    console.log(this.formList);
  }
  removeFormBox(index){
    this.formList.splice(index,1);
    if(this.formList.length == 0){
      this.cekForm = false;
    }
  }
  addOption(){
    this.formBox.formValue.push("");
  }
  removeOption(index){
    if(this.formBox.formValue.length > 1){
      this.formBox.formValue.splice(index,1);
    }else{

    }
  }
  addListOption(jndex){
    this.formList[jndex].formValue.push("");
  }
  removeListOption(jndex,index){
    if(this.formList[jndex].formValue.length > 1){
      this.formList[jndex].formValue.splice(index,1);
    }
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  switchPreview(){
    if(this.preview){
      this.preview = false;
    }else{
      this.preview = true;
    }
  }
  onChange(){
    this.formBox = {
      formType: this.formType,
      formQuestion: "",
      formValue:[""]
    }

    if (this.formBox.formType == "Radio" || this.formBox.formType == "Checkbox")
    {
      this.formBox.formValue = ["", ""];
    }
  }
  createForm(){
    console.log(this.user.getUFAI());
    
    const formCode = this.user.getUsername() + "_" + this.user.getUFAI();
    
    this.newForm = {
      author: this.user.getUsername(),
      formTitle: this.formTitle,
      formDesc: this.formDesc,
      formList: this.formList,
      formResponses: []
    }

    this.user.updateUFAI();
    
    this.afstore.doc(`users/${this.user.getUID()}`).update({
      forms: firestore.FieldValue.arrayUnion(formCode)
    })

    this.afstore.doc(`forms/${formCode}`).set(this.newForm)
    this.router.navigate(['./tabs/forms'])
  }
}
