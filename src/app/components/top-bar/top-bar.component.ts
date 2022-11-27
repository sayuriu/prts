import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

    constructor() { }

    @Input() isEntry!: boolean;

    ngOnInit(): void {
    }

}
