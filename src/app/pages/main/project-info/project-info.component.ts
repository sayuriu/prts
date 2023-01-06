import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'project-info',
    templateUrl: './project-info.component.html',
    styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {

    constructor() { }
    version = "2022.0"
    hash = "b3d9b5f"
    date = "050123"
    message = `bla bla\nooga booga\ndis a string`
    ngOnInit(): void {
}

}
