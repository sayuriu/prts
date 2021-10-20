import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-operator-img',
  templateUrl: './operator-img.component.html',
  styleUrls: ['./operator-img.component.scss']
})
export class OperatorImgComponent implements OnInit {

  constructor() { }

  @Input() opName!: string | null

  ngOnInit(): void {
  }

}
