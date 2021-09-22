import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.css']
})
export class BackgroundImageComponent implements OnInit {
  @Input('origin') page:String = '';
  backgroundClass: String = 'background-img-login'

  constructor() { }

  ngOnInit(): void {
    this.backgroundClass = `background-img-${this.page}`;
  }
}
