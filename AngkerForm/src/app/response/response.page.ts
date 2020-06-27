import { Component, OnInit } from '@angular/core';
import { DocumentData, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormModel } from '../formModel.model';

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
  
  formDoc : AngularFirestoreDocument<FormModel>;
  formDocData : Observable<FormModel>;

  formData : FormModel;
  formTotalScore:number;
  formMaxScore:number;
  formScores : number[];
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

        this.formDoc = this.afstore.doc(`forms/${this.responseData.form}`);
        this.formDocData = this.formDoc.valueChanges();
        this.formScores=[];
        this.formDocData.subscribe(form => {

          this.formData = form;
          this.formMaxScore=0;
          for(let i=0;i<this.formData.formList.length;i++)
          {
            this.formMaxScore+=this.formData.formList[i].formScore;
            if(this.formData.formList[i].isQuiz)
            {
              if(this.formData.formList[i].formType!="Checkbox")
              {
                if(this.formData.formList[i].formAnswer[0]==this.responseData.formAnswer[i].value)
                {
                  this.formScores.push(this.formData.formList[i].formScore);
                }
                else
                {
                  this.formScores.push(0);
                }
              }
              // checkbox
              else
              {
                let cor=true;
                for(let j=0; j<this.responseData.formAnswer[i].value.length; j++)
                {
                  if(!this.formData.formList[i].formAnswer.includes(this.responseData.formAnswer[i].value[j]))
                  {
                    cor=false;
                    break;
                  }
                }
              
                if(cor==false)
                {
                  this.formScores.push(0);
                }
                else
                {
                  this.formScores.push(this.formData.formList[i].formScore);
                }
              }
            }
            else
            {
              this.formScores.push(0);
            }
          }
          this.formTotalScore=0;
          for(let i=0;i<this.formScores.length;i++)
          {
            this.formTotalScore+=this.formScores[i];
          }
        
        })
      })
      
    })
    
  }

}
