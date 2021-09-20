import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { VoteDateService } from '../../services/vote-date.service';

@Component({
  selector: 'app-date-options',
  templateUrl: './date-options.component.html',
  styleUrls: ['./date-options.component.css']
})
export class DateOptionsComponent implements OnInit, DoCheck {
  @Input() currentTrip:any;
  winner: number = -1;

  constructor(private voteDateService: VoteDateService) { }

  getDuplicateArrayElements(arr:any){
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
  }

  winnerDate(){
    let totalMembers = this.currentTrip.invitedFriends.length;
    let voteOne = this.currentTrip.date.totalVote.one;
    let voteTwo = this.currentTrip.date.totalVote.two;
    let voteThree = this.currentTrip.date.totalVote.three;

    if(totalMembers == voteOne + voteTwo + voteThree){
      let allVotes:number[] = [voteOne, voteTwo ,voteThree];
      let largestValue:number = Math.max(...allVotes);

      //Check if there is repeated votes
      let hasDuplicate = allVotes.some((val, i) => allVotes.indexOf(val) !== i);
      let calculateWinner = true;

      if(hasDuplicate){
        let duplicatedList = this.getDuplicateArrayElements(allVotes); // return a array of numbers that are duplicated

        if(duplicatedList[0] < largestValue){
          calculateWinner = true // if there are repeated votes [1,1] and the largest number is 2, we can calculate the winner 

        } else if (duplicatedList[0] == largestValue){
          calculateWinner = false // if there are repeated votes [2,2] and they are the largest number, the winner can not be calculated untill the team find a democratic budget.
        }
      }

      //Store the winner
      if(calculateWinner){
        this.winner = allVotes.findIndex(el=> el == largestValue);
      }
      
    }else {
      this.winner = -1; // no winner
      return
    }
  }

  ngOnInit(): void {
   
    if(!this.currentTrip){
      this.currentTrip = {
        status:{
          hasAcceptedInvitation: false
        },
        invitedFriends: [],
        date:{
          one: {start: 0, end: 0},
          two: {start: 0, end: 0},
          three: {start: 0, end: 0},
          userVotedOn: 0,
          totalVote: {
            one: 0,
            two: 0,
            three: 0
          }
        }
      }
    }
  }

  ngDoCheck(){
    this.winner = -1;
    if(this.currentTrip.invitedFriends.length > 0){
      this.winnerDate()
    } 
  }

  saveDatePreferences(option: string){
    this.voteDateService.voteDate(option)
  }
}
