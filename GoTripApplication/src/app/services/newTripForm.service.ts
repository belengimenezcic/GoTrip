/*
* These functions are used on the create new trip page.
*
*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

import { currentUser } from './getCurrentUserData.service';

@Injectable()
export class createNewTrip {
    invitedFriends: {email:String, id:String}[] = []; // list of emails

    constructor(private currentUser: currentUser){ }
    /*
    * Get the email informed in the input and save it in the
    * variable invitedFriend. It store and email and create an id
    * for each email so that they can be deleted
    */
    invite(el:any){
        this.invitedFriends.push({
          email: el,
          id: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase() //Create a radomn id to the user so he/she can be deleted
        });
      }
    /*
    * Delet the selected email from the invitedFriends 
    */
    deleteInvitation(key: String) {
      this.invitedFriends.forEach((value,index)=>{
          if(value.id==key) this.invitedFriends.splice(index,1);
      });
  } 
  /*
  * remove all invited friends from the variable invitedFriends
  */
  cleanInvitationList() {
    this.invitedFriends = []
  }
  /*
  * This function will get the information from the form and save it in Parse
  * in different classes: TripsPlan, Date, Budget and NonUserInvited.
  */
  async saveTripOnParse(formData:any){
    const TripsPlan = Parse.Object.extend('TripsPlan'); // Store info about city, title, owner, invited users
    const Date = Parse.Object.extend('Date'); // store the 3 dates and the users vote
    const Budget = Parse.Object.extend('Budget'); // store the 3 budgets and the users vote
    const NonUserInvited = Parse.Object.extend('NonUserInvited'); // store email of peopel who does not have a Gotrip account

    const user = new Parse.User();
    user.id = this.currentUser.userId; // Identify the current user

    let tripsPlan = new TripsPlan();
    let date = new Date();
    let budget = new Budget();
    let nonUserInvited = new NonUserInvited();

    const relation = tripsPlan.relation("listUsersPending2") // Realational data to save lis tof users

    try{
        /*
        * Save the date in the class TripPlan: city, listUsersPending, finished = false, owner ID, title
        */
        await tripsPlan.save({
          title: formData.title,
          city: formData.destination,
          finished: false,
          owner: user,
        })
        /*
        * Check if there is an user with the emails informed. If yes, add them in the listUsersPendind.
        */
          let friendsHaveAccount = []; // Peopel who have Gotrip account
          let friendsZeroAccount = []; // People does not have Gotrip account

          //Find if the users has account or not
          for (let i = 0; i < formData.invitedFriends.length; ++i){
            let friendEmail = formData.invitedFriends[i];
           
            let queryUser = new Parse.Query(Parse.User);
            queryUser.equalTo("email", friendEmail.email);
            let userFound = await queryUser.find() || false;
            
            if(userFound[0]){
              friendsHaveAccount.push(userFound[0])
            } else {
              friendsZeroAccount.push(friendEmail.email)
            }
          }

          //Save in TripPlan all friends who have account as relational data
          relation.add(friendsHaveAccount);
          await tripsPlan.save();
          
          //Save in NonUserInvited the users who does not have an account
          friendsZeroAccount.forEach(async function(email) {
            let nonUserInvited = new NonUserInvited();

            await nonUserInvited.save({
              Email: email,
              tripsPlanId: tripsPlan
              })
          })
 
      /*
      *Save budget options in the class Budget: tripsPlanId, budgetOne, budgetTwo, budgetThree
      */
      await budget.save({
        budgetOne: +formData.budget.one,
        budgetTwo: +formData.budget.two,
        budgetThree: +formData.budget.three,
        tripsPlanId: tripsPlan
      })
      /*
      *Save dates options in the class Date: tripsPlanId, dataOneStart, dataOneEnd, dataTwoStart, dataTwoEnd, dataThreeStart, dataThreeEnd
      */
      await date.save({
        dateOneStart: formData.date.one.start,
        dateOneEnd: formData.date.one.end, 
        dateTwoStart: formData.date.two.start,
        dateTwoEnd: formData.date.two.end, 
        dateThreeStart: formData.date.three.start,
        dateThreeEnd: formData.date.three.end, 
        tripsPlanId: tripsPlan
      })
      /*
      * Send email to invited friends using Cloud code on Parse to protect the
      * SendGrid key Code
      */
      await Parse.Cloud.run("sendInvitation", formData).then(response=>console.log(response))

    }catch(err){
      console.log(err)
    }
  }
}