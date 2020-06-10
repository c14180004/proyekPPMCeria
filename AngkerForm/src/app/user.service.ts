import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { DocumentData } from '@angular/fire/firestore/interfaces';

interface user {
    username: string,
    uid: string
}

@Injectable()
export class UserService {
    private user: user
    private ufai: number
    private ufaiData : DocumentData
    constructor (private afAuth: AngularFireAuth,public afstore: AngularFirestore) {
        
    }

    setUser(user: user) {
        this.user = user;
    }

    getUID(): string {
        return this.user.uid;
    }

    getUsername(): string {
        return this.user.username;
    }

    async isAuthenticated() {
        if (this.user) {
            return true;
        }
        
        const user = await this.afAuth.authState.pipe(first()).toPromise()
        if (user) {
            this.setUser({
                username: user.email.split('@')[0],
                uid: user.uid
            });
            this.afstore.doc(`users/${this.user.uid}`).valueChanges().subscribe(async formAiData =>{
                this.ufaiData = formAiData;
                this.ufai = +this.ufaiData.formAi;
                console.log(this.ufai)
            })
            return true;
        }
        return false;
    }
    getUFAI() : number{
        return this.ufai
    }
    updateUFAI(){
        this.afstore.doc(`users/${this.user.uid}`).update({
            formAi: (this.ufai + 1).toString()
        })
    }
}