import { Component, Input, OnInit } from '@angular/core';
import { AppearDisappear, slideRtL } from '@utils/anims';

@Component({
  selector: 'app-operator-img',
  templateUrl: './operator-img.component.html',
  styleUrls: ['./operator-img.component.scss'],
  animations: [
    // AppearDisappear,
    slideRtL,
  ]
})
export class OperatorImgComponent implements OnInit {

  constructor() { }

  @Input() opName!: string | null

  ngOnInit(): void {

  }

}
