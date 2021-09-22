import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { currentUser } from '../services/getCurrentUserData.service';
import * as Parse from 'parse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private updateHead:any;
  loggedUser:boolean = false;

  @Input()
  user: string;
  photoUrl: string;

  constructor(private currentUser: currentUser, private router:Router)  {
    this.user = '';
    this.photoUrl = '';
    //Subject to update the navigation when the user logs in
    this.updateHead = this.currentUser.updateUICurrentUser.subscribe(()=>{
      this.getUserDate();
    })
  }

  ngOnInit(): void {
    this.getUserDate()
  }

  getUserDate(){
    const currentUser = Parse.User.current();
    if (currentUser) {
      this.user = currentUser.id;
      const photo = currentUser.get('photo');
      this.photoUrl = photo.url();
      this.loggedUser = true;
    }
  }
  /*
  * Write here the logout function
  */
  async logOut(){
    await Parse.User.logOut()
    this.currentUser.cleanCurrentUser();
    this.loggedUser = false;
    this.getUserDate() // Update the header to remove the button to create new trips and the user profile photo
    this.router.navigate(['/']);
  }
  /*
  * Function to run when the user clicks on the logo
  */
  logoButton(){
    if(this.loggedUser){
      this.router.navigate(['/dashboard']); // Logged users go to the dashboard
    } else {
      this.router.navigate(['/']); // unlogged users go the to login page
    }
  }
  /*
  * Destroy the subscription
  */
  ngOnDestroy(){
    this.updateHead.unsubscribe();
  }
}
