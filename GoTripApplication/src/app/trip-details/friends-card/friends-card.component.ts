import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { GetFriendsService } from '../../services/get-friends.service';

@Component({
  selector: 'app-friends-card',
  templateUrl: './friends-card.component.html',
  styleUrls: ['./friends-card.component.css']
})
export class FriendsCardComponent implements OnInit, OnDestroy {
  @Input() currentTrip:any;

  constructor(private getFriendsService: GetFriendsService) { }

  ngOnInit(): void {
    if(!this.currentTrip){
      this.currentTrip = {
        invitedFriends: [] 
      }
    } else { 
    }
  }

  ngOnDestroy(){
    this.currentTrip = {
      invitedFriends: [] 
    }
  }
}
