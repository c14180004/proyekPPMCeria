import { Component, OnInit } from '@angular/core';
import { FormBox } from '../formBox.model';
import { FormModel } from '../formModel.model';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
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
  isSubmitting: boolean;
  isCancelling: boolean;

  formCode: string;
  formDeadline: Date;

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

  formDoc : AngularFirestoreDocument;

  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public router: Router,
    public storage: AngularFireStorage
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.formCount = 0;
    this.isUploading = false;
    this.isUploaded = false;
    this.cekForm = false;
    this.preview = false;
    this.formType = "Text"
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:[""],
      formAnswer:[""],
      formScore:0,
      isQuiz:false
    }
    this.isSubmitting = false;
    this.isCancelling = false;
    this.formCode = "";
  }

  ionViewWillLeave() {
    if (!this.isSubmitting)
    {
      this.isCancelling = true;
      this.deleteAllImages();
    }
    
    // Hapus image yg sdh diupload tapi tidak diadd
    this.deleteImage();
  }

  uploadFile(event: FileList){
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
     }

     this.isUploading = true;
     this.isUploaded = false;
     this.fileName = file.name;
     const path = `imageStorage/${new Date().getTime()}_${file.name}`;
     const fileRef = this.storage.ref(path);
     this.task = this.storage.upload(path, file);
     this.percentage = this.task.percentageChanges();
     this.snapshot = this.task.snapshotChanges().pipe(
       
       finalize(() => {
         this.UploadedFileURL = fileRef.getDownloadURL();
         
         this.UploadedFileURL.subscribe(resp=>{
          this.formBox = {
            formType: "Image",
            formQuestion: resp,
            formValue:[path],
            formAnswer:[""],
            formScore:0,
            isQuiz:false
          }
           this.isUploading = false;
           this.isUploaded = true;

          if (this.isCancelling)
          {
            this.deleteImage();
          }

         },error=>{
           console.error(error);
         })
       }),
       tap(snap => {
           this.fileSize = snap.totalBytes;
       })
     )
  }
  addFormBox(){
    this.isUploading = false;
    this.isUploaded = false;
    this.cekForm = false;
    this.formBox.formType = this.formType;
    this.formList.push(this.formBox);
    
    this.onChange("2");

    this.formCount = this.formCount + 1;
    console.log(this.formList);
    for(var i = 0;i<this.formList.length;i++){
      if(this.formList[i].formType != "Image"){
        this.cekForm = true;
      }
    }
  }
  deleteImage(){
    const fileRef = this.storage.ref(this.formBox.formValue[0]);
    try{
      fileRef.delete();
      console.log("delete Image success");
    }catch{
      console.log("delete Image failed")
    }
    this.isUploading = false;
    this.isUploaded = false;
  }

  deleteAllImages(){
    try{
      console.log("task cancelled");
      this.task.cancel();
    }
    catch{
      console.log("failed to cancel task");
    }

    if (this.formBox.formType == "Image")
    {
      this.deleteImage();
    }

    for (let i = 0; i < this.formList.length; i++) {
      
      if(this.formList[i].formType == "Image"){
        const fileRef = this.storage.ref(this.formList[i].formValue[0]);
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
  }

  removeFormBox(index){
    if(this.formList[index].formType == "Image"){
      const fileRef = this.storage.ref(this.formList[index].formValue[0]);
      try{
        fileRef.delete();
        console.log("delete Image success");
      }catch{
        console.log("delete Image failed")
      }
      
    }
    this.formList.splice(index,1);
    this.cekForm = false;
    for(var i = 0;i<this.formList.length;i++){
      if(this.formList[i].formType != "Image"){
        this.cekForm = true;
      }
    }
  }
  addOption(){
    this.formBox.formValue.push("");
    if(this.formBox.formType=="Checkbox")
    {
      this.formBox.formAnswer.push("false");
    }
  }
  removeOption(index){
    if(this.formBox.formValue.length > 1){
      this.formBox.formValue.splice(index,1);
      if(this.formBox.formType=="Checkbox")
      {
        this.formBox.formAnswer.splice(index,1);
      }
    }
  }
  addListOption(jndex){
    this.formList[jndex].formValue.push("");
    if(this.formList[jndex].formType=="Checkbox")
    {
      this.formList[jndex].formAnswer.push("false");
    }
  }
  removeListOption(jndex,index){
    if(this.formList[jndex].formValue.length > 1){
      this.formList[jndex].formValue.splice(index,1);
      if(this.formList[jndex].formType=="Checkbox")
      {
        this.formList[jndex].formAnswer.splice(index,1);
      }
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
  onChange(cek){
   
    if(this.formBox.formType == "Image" && cek == "1"){
      const fileRef = this.storage.ref(this.formBox.formValue[0]);
      try{
        fileRef.delete();
        console.log("delete Image success");
      }catch{
        console.log("no Image to delete");
      }
    }else{
      console.log("no Image to delete")
    }
    this.isUploading = false;
    this.isUploaded = false;
    this.formBox = {
      formType: this.formType,
      formQuestion: "",
      formValue:[""],
      formAnswer:[""],
      formScore:0,
      isQuiz:false
    }

    if (this.formBox.formType == "Radio" || this.formBox.formType == "Checkbox")
    {
      this.formBox.formValue = ["", ""];
    }
    if(this.formBox.formType == "Checkbox")
    {
      this.formBox.formAnswer=["false","false"];
    }

  }
  createForm(){
    for(var i=0;i<this.formList.length;i++)
    {
    
      if(this.formList[i].formType == "Checkbox")
      {
        let temp=[];
        for(var j=0;j<this.formList[i].formAnswer.length;j++)
        {
          if(this.formList[i].formAnswer[j].toString()=="true")
          {
            temp.push(this.formList[i].formValue[j]);
          }
        }
        this.formList[i].formAnswer=temp;
      }
     if(!this.formList[i].isQuiz)
     {
       this.formList[i].formAnswer=[];
       this.formList[i].formScore=0;
     }
    }
    this.isSubmitting = true;
    console.log(this.user.getUFAI());

    let str = new Date(this.formDeadline).toDateString();

    this.newForm = {
      author: this.user.getUsername(),
      formTitle: this.formTitle,
      formDesc: this.formDesc,
      formList: this.formList,
      formResponses: [],
      formDeadline: str
    }

    this.user.updateUFAI();
    
    this.afstore.doc(`users/${this.user.getUID()}`).update({
      forms: firestore.FieldValue.arrayUnion(this.formCode)
    })

    this.afstore.doc(`forms/${this.formCode}`).set(this.newForm);
    this.router.navigate(['./tabs/forms']);
  }

  checkPromoCode(){
    this.formDoc = this.afstore.doc(`forms/${this.formCode}`);
      this.formDoc.get().subscribe(action =>{
        if(action.exists){
          //Sudah ada
          this.presentAlert("Error!", "Form code (nickname) is not available!");
          return;
        }
        else
        {
          this.createForm();
          return;
        }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })

    await alert.present();
  }

  test()
  {
    console.log(this.formBox.formAnswer);
  }
  check2(i)
  {
    console.log(this.formList[i].formAnswer);
  }
}
