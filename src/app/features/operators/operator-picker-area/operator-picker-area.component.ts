import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { waitAsync } from '@utils/utils';

@Component({
  selector: 'app-operator-picker-area',
  templateUrl: './operator-picker-area.component.html',
  styleUrls: ['./operator-picker-area.component.scss']
})
export class OperatorPickerAreaComponent implements OnInit, OnChanges
{
	constructor() { }

	@Input() visible = true;

	isShown = false;
	filterVisible = false;
	ngOnInit(): void {
		this.filterButtonVisible = this.visible;
		void this.ToggleFilterMenu(this.visible);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.visible)
			void this.ToggleFilterMenu(changes.visible.currentValue);
	}

	filterButtonVisible = false;
	async ToggleFilterMenu(overrideBool?: boolean)
	{
		this.filterVisible = overrideBool !== undefined ? overrideBool : !this.filterVisible;
		await waitAsync(300);

		this.isShown = overrideBool !== undefined ? overrideBool : !this.isShown;
		if (!this.visible)
			this.filterButtonVisible = false;
	}
}
