import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operator-info-area',
  templateUrl: './operator-info-area.component.html',
  styleUrls: ['./operator-info-area.component.scss']
})
export class OperatorInfoAreaComponent implements OnInit {

  constructor() { }

  @Input() opName!: string

  ngOnInit(): void {
  }

}
