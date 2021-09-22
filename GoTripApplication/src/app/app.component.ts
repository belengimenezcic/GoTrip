import { Component, OnInit } from '@angular/core';
import {environment} from '../environments/environment';
import * as Parse from 'parse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'GoTrip';

  constructor(){
    // Start the connection with the back-end
    Parse.initialize(environment.serverId, environment.serverMasterKey);
    (Parse as any).serverURL = environment.serverUrl;
  };
}
