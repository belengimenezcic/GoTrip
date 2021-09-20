import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from 'parse';
import { currentUser } from '../../services/getCurrentUserData.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  email: string = ''
  password: string = ''
  username: string = ''

  constructor(private router: Router, private currentUser:currentUser) { }

  ngOnInit(): void {
  }

    onKey(event: any) {
      switch (event.target.id) {
        case "name":
          this.username = event.target.value;
          break;
        case "InputEmail":
          this.email = event.target.value;
          break;
        case "InputPassword":
          this.password = event.target.value;
          break;
      }
  }

  async onClickMe() {
    const user = new Parse.User();
    const avatarBase65:string = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wgARCACBAIEDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAECAwQH/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAfQKFgAAAAAC1R0OcAAAAAAAAAAAANJDO9zAAAAAAAG+GsxjvWxgKAAAAAEi2sRSm0nOvSgAAAAGmclqTAmBvhMAAAAAAAAAAAABaoAAAAAAJIbC3OQFAAAAANg1Ev8A/8QAIBAAAQQCAwADAAAAAAAAAAAAAQACERIwMRAhMkBQYP/aAAgBAQABBQImc4MKw+7qVQ52hFysUexlHjhvnK0wi1UTjAzSQpOba6arq6kFOEZGbd65fr8URHwKJ2szOP/EABQRAQAAAAAAAAAAAAAAAAAAAGD/2gAIAQMBAT8BI//EABQRAQAAAAAAAAAAAAAAAAAAAGD/2gAIAQIBAT8BI//EABoQAAICAwAAAAAAAAAAAAAAABARACFQYHD/2gAIAQEABj8C1tyg8BQXIf/EACIQAAIBAgYDAQAAAAAAAAAAAAABETAxICFAQVBhEFFxsf/aAAgBAQABPyF7dV2NlzkndDBqK28HyErsVRtfVsydyE24iBXVlI31kpQZJD0Q9CypK6qfiXsFn7UTasXwNt3fNSIrpS4R9aD3eP/aAAwDAQACAAMAAAAQd999999tN999999999999pF99999993z9999999TD99999951t9999999999999199999999f99999998//EABQRAQAAAAAAAAAAAAAAAAAAAGD/2gAIAQMBAT8QI//EABoRAAICAwAAAAAAAAAAAAAAAAERABAgMFD/2gAIAQIBAT8Q0LvuDM1//8QAJBABAAEDBAIBBQAAAAAAAAAAAREAITAxQVFhEHFQIIGRobH/2gAIAQEAAT8QR36GeUL7fORssDugFkaRQkOY2djSlIUBvzTF2HDW4wJM17DWHzal0lzAloHfiroBOzTW8Dqt1cR6M5EWOEoaLnopGbzPeVxGrSltf9td2u7+avsu7NaHq0yalEvRHkURNSjcyEJSPTSqlVeX6BoRO35plR6zoQStRp/bPp8P/9k="
    const parseFile = new Parse.File('avatar.jpg', {base64: avatarBase65});

    user.set("username", this.username);
    user.set("password", this.password);
    user.set("email", this.email);
    user.set("photo", parseFile) // Save the default avatar as user photo

       try {
          await user.signUp();
          this.router.navigate(['dashboard']); // Move user to dahsboar after create account
        } catch (error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
  }
}
