import { Component, OnInit } from '@angular/core';
import { getTrip } from '../services/getTrip.service';
import { currentUser } from '../services/getCurrentUserData.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = this.currentUser.name; // Get user name to show on dahsboard
  currentTrips: {}[] = []; // list of current trips
  oldTrips: {}[] =[]; // List of finished trips
  isLoading: boolean = true; // a Boolean to activate or deactivate the loading spinner

  constructor(private getTrip: getTrip, private currentUser: currentUser) { }

  async ngOnInit(): Promise<any> {
    this.isLoading = true; // Show the spinner
    await this.currentUser.getCurrentUser(); // save the current user id and name
    await this.getTrip.fetchParseData(); // Call a function from service folder to get data
    this.currentTrips = this.getTrip.currentTrips; // Store open trips
    this.oldTrips = this.getTrip.oldTrips; // store finished trips
    this.isLoading = false; // Hide spinner
    this.userName = this.currentUser.name;    
  }

  /*
  * Update the variables storing data that are first saved on the service
  */
  update(){
    this.currentTrips = this.getTrip.currentTrips;
    this.oldTrips = this.getTrip.oldTrips;
  }
}
