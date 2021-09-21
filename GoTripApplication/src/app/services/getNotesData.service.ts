import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { currentUser } from './getCurrentUserData.service';
import { getTripDetails } from './getTripDetails.service';
import * as Parse from 'parse';

// type Note = {
//     body: String
//     user: String
//     me: Boolean
//     date: Date
// }

class Note {
    public body: String = "";
    public user: String = "";
    public me: Boolean = false;
    public date: Date = new Date();
    public photo: String ="";
    constructor() { }
}

@Injectable()
export class NoteService {
    private subscription: any;
    private query: any
    user: any = this.currentUser;

    constructor(private currentUser: currentUser, private getTripDetails: getTripDetails,) { }

    /*
    * This function get the subscription from Parse live query and save it in 
    * the variable subscription
    */
    async parseLive() {
        if (!this.subscription) {
            this.query = new Parse.Query('Note');
            this.subscription = await this.query.subscribe();
        }
    }

    async getNotes() {
        // this method works, but maybe subscription open is the better option
        this.query.equalTo('tripId', this.getTripDetails.currentTrip.id)
        let notes: any = []
        let results = await this.query.find()
        for (let i = 0; i < results.length; i++) {
            let note = new Note()
            const object = results[i];
            let user = object.get('user')
            let from = object.get('from')
            note.body = object.get('note')
            note.date = object.get('createdAt')

            let noteWriter =  new Parse.Query(Parse.User);
            noteWriter.equalTo('objectId', user)
    
            let ownerData = await noteWriter.find(); // Search data about the user on Parse     
         
            note.photo = await ownerData[0].get('photo')._url;
            note.user = from != null ? from : 'Anonymous'
            note.me = user != null ? (user === this.user.userId) : false
            notes.push(note)
        }
        return notes
    }

    startToUpdate() {
        return new Observable(observer => {
            this.subscription.on('create', (news: any) => {
                let note = new Note()
                let user = news.get('user')
                let from = news.get('from')
                note.body = news.get('note')
                note.date = news.get('createdAt')
                note.user = from != null ? from : 'Anonymous'
                note.me = user != null ? (user === this.user.userId) : false
                observer.next(note)
            })
        })
    }

    stopUpdate() {
        this.subscription.unsubscribe()
    }

    sendNote(note: string): Observable<boolean> {
        var News = Parse.Object.extend("Note");
        const currentUser:any = Parse.User.current()
        // const photo = currentUser.get('photo');
        var news = new News();
        news.set("note", note);
        news.set("user", this.user.userId);
        news.set("from", this.user.name)
        // let photo = currentUser[0].get('photo')._url;
        // news.set("photo", photo )
        // news.set("photo", currentUser.photo)
        news.set("tripId", this.getTripDetails.currentTrip.id)
        news.save()
        return new Observable(observer => {
            news.save(null, {
                success: (result: any) => {
                    observer.next(true)
                    observer.complete()
                },
                error: (error: string) => {
                    observer.error(error)
                }
            })
        })
    }
}

