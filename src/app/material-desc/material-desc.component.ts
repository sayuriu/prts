import {Component, Input, OnInit} from '@angular/core';
import {ItemMaterial} from "@struct/Item";
import {Nullable} from "@utils/utils";
import {OperatorDataManagerService} from "@services/OperatorData/operator-data-manager.service";

@Component({
  selector: 'ak-item-desc',
  templateUrl: './material-desc.component.html',
  styleUrls: ['./material-desc.component.scss']
})
export class MaterialDescComponent implements OnInit {
    constructor(
        private manager: OperatorDataManagerService
    ) { }

    @Input() itemId!: string;

    item: Nullable<ItemMaterial> = null;
    expanded = false;
    async ngOnInit() {
        this.item = await this.manager.getMaterialData(this.itemId);
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }
}
