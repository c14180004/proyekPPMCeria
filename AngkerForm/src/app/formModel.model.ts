import { FormBox } from './formBox.model';

export interface FormModel{
    author: string;
    formTitle: string;
    formDesc: string;
    formList: FormBox[];
    formResponses: string[];
}