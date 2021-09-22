import { Component, OnInit, ViewChild } from '@angular/core';
import { germany } from './cities/germany';
import { createNewTrip } from '../services/newTripForm.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { currentUser } from '../services/getCurrentUserData.service';

@Component({
  selector: 'app-new-trip-form',
  templateUrl: './new-trip-form.component.html',
  styleUrls: ['./new-trip-form.component.css']
})
export class NewTripFormComponent implements OnInit {
  @ViewChild('formValue') sigupForm:any; // Get values from the inputs
  cities:{id:Number, name:String}[] = []; // Store the german cities from the cities folder
  invitedFriend: String = '';
  invitedFriends: {}[] = [];

  /*
  * This object will be sent to the service that will be responsable to
  * save it on Parse
  */
  tripForm = {
    ownerName: this.currentUser.name, 
    title: null,
    destination: null,
    budget: {
      one: null,
      two: null,
      three: null
    },
    date: {
      one: {},
      two: {},
      three: {}
    },
    invitedFriends: [{}],
  }

  constructor(private createNewTrip: createNewTrip, private router: Router, private currentUser: currentUser ) {
    /*
    * get list of germany cities from cities folder and save each item as a
    * object with id and name inside an array
    */
    for(let i =0; i<germany.length; i++){
      this.cities.push({
        id: i+1,
        name: germany[i]
      })
    }
   }

  ngOnInit(): void {
    this.invitedFriends = this.createNewTrip.invitedFriends;
  }

  /*
  *Add current written email to the array: invitedFriends to save all friends email
  */
  invite(){
    this.createNewTrip.invite(this.invitedFriend);
  }

  /*
  * Get data from the data picker and save on the tripform object
  */
  fillDates(el:any){
    let dateId = el.id;

    if(dateId === 'one'){
      this.tripForm.date.one = {start: new Date(el.date.start), end: new Date(el.date.end)} 
    }else if (dateId === 'two'){
      this.tripForm.date.two = {start: new Date(el.date.start), end: new Date(el.date.end)}
    }else if (dateId === 'three'){
      this.tripForm.date.three = {start: new Date(el.date.start), end: new Date(el.date.end)}
    } else { }
  }

  /*
  * Function that run after user fills the form and clicks on create button
  */
  async createPlan(el: NgForm, buttonId: any){
    if (buttonId !== "createTripPlan") return;

    //fill tripForm object
    this.tripForm.title = el.value.Title;
    this.tripForm.destination = el.value.city.name;
    this.tripForm.budget.one = el.value.budget_1;
    this.tripForm.budget.two = el.value.budget_2;
    this.tripForm.budget.three = el.value.budget_3;
    this.tripForm.invitedFriends = this.invitedFriends;
    //call function from newTripForm.service to save data into Parse
    await this.createNewTrip.saveTripOnParse(this.tripForm)
    //Go back to dashboard
    this.cancel();
    //Clean friends list
    this.createNewTrip.cleanInvitationList()
  }

  /*
  * calcel the form and go back to the dashboar
  */
  cancel(){
    this.createNewTrip.cleanInvitationList() //Clean frinds list
    this.router.navigate(['../dashboard']) // Go back to dashboard
  }
}
