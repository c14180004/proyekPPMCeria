import { Component, OnInit } from '@angular/core';
import { FormBox } from '../formBox.model';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.page.html',
  styleUrls: ['./new-form.page.scss'],
})
export class NewFormPage implements OnInit {
  formBox: FormBox;
  formList: FormBox[] = [];
  formType: string;
  preview: boolean;
  constructor() { }
  ngOnInit() {
    this.preview = false;
    this.formType = "Text"
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:["",""] ,
    }
  }
  addFormBox(){
    
    this.formBox.formType = this.formType;
    this.formList.push(this.formBox);
    this.formBox = {
      formType: "Text",
      formQuestion: "",
      formValue:["",""]
    }
    console.log(this.formList);
  }
  addOption(){
    this.formBox.formValue.push("");
  }
  removeOption(){
    this.formBox.formValue.pop();
  }
  addListOption(index){
    this.formList[index].formValue.push("");
  }
  removeListOption(index){
    this.formList[index].formValue.pop();
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
}
