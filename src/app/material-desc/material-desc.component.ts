import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { ItemMaterial } from "@struct/Item";
import {Nullable, waitAsync} from "@utils/utils";
import { OperatorDataManagerService } from "@services/OperatorData/operator-data-manager.service";

@Component({
  selector: 'ak-item-desc',
  templateUrl: './material-desc.component.html',
  styleUrls: ['./material-desc.component.scss']
})
export class MaterialDescComponent implements OnInit, OnChanges {
    constructor(
        public manager: OperatorDataManagerService
    ) { }

    @Input() itemId!: string;
    @Input() expanded = false;
    @Input() limitWidth = null;

    @Output() onExpand = new EventEmitter<boolean>();

    item: Nullable<ItemMaterial> = null;
    transitioning = false;
    async ngOnInit() {
        this.item = await this.manager.getMaterialData(this.itemId);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.expanded && !changes.transitioning)
            this.overflowShown = this.expanded;
    }

    resolveMatType()
    {
        if (!this.item) return '';
        if (this.item.itemType)
            return this.item.itemType + '/';
        if (this.item.classifyType)
            return this.item.classifyType + '/';
        return '';
    }

    overflowShown = false;
    toggleExpand() {
        if (this.transitioning) return;
        this.transitioning = true;
        this.expanded = !this.expanded;
        this.onExpand.emit(this.expanded);
        if (!this.expanded && !this.transitioning)
            this.overflowShown = false;
        else
            waitAsync(300).then(() => this.overflowShown = true);        setTimeout(() => {
            this.transitioning = false;
        }, 500);
    }

    getExpand()
    {
        if (this.transitioning && !this.withinButton) {
            return !this.expanded ? 'collapse' : 'expand';
        }
        return this.expanded ? 'collapse' : 'expand';
    }

    getAction() {
        if (this.withinButton)
            return 'Double-click';
        return 'Click';
    }

    withinButton = false;
    onMouseEnter() {
        this.withinButton = true;
    }
    onMouseLeave() {
        this.withinButton = false;
    }
}
