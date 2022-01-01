import { Component, OnInit, OnDestroy } from '@angular/core';
import { waitSync } from '@utils/utils';

@Component({
  selector: 'app-operator-picker-area',
  templateUrl: './operator-picker-area.component.html',
  styleUrls: ['./operator-picker-area.component.scss']
})
export class OperatorPickerAreaComponent implements OnInit, OnDestroy
{
	constructor() { }

	isShown = false;
	filterVisible = false;
	ngOnInit(): void {
		this.ToggleFilterMenu(true);
	}
	ngOnDestroy(): void {
		this.ToggleFilterMenu(false);
	}

	ToggleFilterMenu(overrideBool?: boolean)
	{
		this.filterVisible = overrideBool !== undefined ? overrideBool : !this.filterVisible;
		waitSync(300);
		this.isShown = overrideBool !== undefined ? overrideBool : !this.isShown;
	}
}
