import { Component, OnInit } from '@angular/core';
import { AppService } from "@services/app.service";

@Component({
  selector: 'invalid-screen',
  templateUrl: './invalid-screen.component.html',
  styleUrls: ['./invalid-screen.component.scss']
})
export class InvalidScreenComponent implements OnInit {

    constructor(
        public app: AppService
    ) { }

    ngOnInit(): void {

    }

}
