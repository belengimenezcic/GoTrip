import { Component, OnInit, NgZone } from '@angular/core';
import * as Parse from 'parse';
import { getTripDetails } from '../../services/getTripDetails.service';

import { NoteService } from '../../services/getNotesData.service';

interface Note {
  text: string;
  user: string;
  createdAt: Date;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  currentUser = Parse.User.current();
  notes: any[] = []
  noteValue = ""

  constructor(private getTripDetails: getTripDetails, private noteSvc: NoteService, private zone: NgZone) { }

  async ngOnInit() {
    await this.noteSvc.parseLive(); // Start the Parse live query subscription 
    this.notes = await this.noteSvc.getNotes()
   
    this.noteSvc.startToUpdate()
      .subscribe(note => {
        this.zone.run(() => {
          this.notes.push(note)
        })
      })
  }

  ngOnDestroy() {
    this.noteSvc.stopUpdate()
  }

  sendNote(note: string) {
    this.noteSvc.sendNote(note)
      .subscribe(success => {
      }, error => {
        alert(error)
      }, () => {
        this.noteValue = ''
      })
  }

  getNoteClass(note: any) {
    if (note.me) {
      return 'right'
    } else {
      return 'left'
    }
  }







}


