import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from 'parse';
import { currentUser } from '../../services/getCurrentUserData.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string = ''
  password: string = ''

  constructor(private router: Router, private currentUser: currentUser) { }

  ngOnInit(): void {
  }

  onKey(event: any) {
    switch (event.target.id) {
      case "InputEmail":
        this.email = event.target.value;
        break;
      case "InputPassword":
        this.password = event.target.value;
        break;
    }
  }

  async onClickMe(){
    try{
      await Parse.User.logIn(this.email, this.password);
      this.router.navigate(['dashboard']);
    }catch(error:any){
      //Show the error message 
      alert("Error: " + error.code + ' ' + error.message)
    } 
  }
}
