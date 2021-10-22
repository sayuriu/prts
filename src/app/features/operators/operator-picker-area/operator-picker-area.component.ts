import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operator-picker-area',
  templateUrl: './operator-picker-area.component.html',
  styleUrls: ['./operator-picker-area.component.scss']
})
export class OperatorPickerAreaComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {

	}

	filterVisible = true;
	ToggleFilterMenu()
	{
		this.filterVisible = !this.filterVisible;
	}
}
