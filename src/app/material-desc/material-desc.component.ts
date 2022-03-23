import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ItemMaterial } from "@struct/Item";
import { Nullable, waitAsync } from "@utils/utils";
import { OperatorDataManagerService } from "@services/OperatorData/operator-data-manager.service";
import { OperatorUtilsService } from "@services/OperatorData/op-utils.service";


//TODO: retro_table.json
// Update parser structure tree
@Component({
  selector: 'ak-item-desc',
  templateUrl: './material-desc.component.html',
  styleUrls: ['./material-desc.component.scss']
})
export class MaterialDescComponent implements OnInit, OnChanges {
    constructor(
        public manager: OperatorDataManagerService,
        public opUtils: OperatorUtilsService
    ) { }

    hoverTimeout = -1;
    suggestionVisible = false;

    @Input() itemId!: string;
    @Input() expanded = false;
    @Input() limitWidth = null;

    @Output() onExpand = new EventEmitter<boolean>();

    item: Nullable<ItemMaterial> = null;
    transitioning = false;
    loading = true;
    dropRates!: { stageId: string, stageName: string, rates: string }[];

    async ngOnInit() {
        this.item = await this.manager.getMaterialData(this.itemId);

        //TODO: Maybe cache this as well? XML may be slow
        this.dropRates = await Promise.all(
            Object
                .entries(await this.manager.getMaterialDropRate(this.itemId) ?? {})
                .map(async ([key, value]) => {
                    let rate = -1;
                    if (('quantity' in value || 'times' in value))
                        rate = Number((value.quantity / value.times * 100).toFixed(2));
                    const { code, name } = await this.manager.getStageIdName(key);
                    return {
                        stageId: code,
                        stageName: name,
                        rates: rate === -1 ? 'N/A%' : (rate.toString() + '%')
                    }
                })
            ).then(v => v.sort((a, b) => {
                const aUndef = a.rates === 'N/A%' || a.rates === '0%';
                const bUndef = b.rates === 'N/A%' || b.rates === '0%';
                if (aUndef && !bUndef) return 1;
                if (aUndef && bUndef) return 0;
                if (!aUndef && bUndef) return -1;
                return parseFloat(b.rates.slice(0, -1)) - parseFloat(a.rates.slice(0, -1));
            }));
        this.loading = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.expanded && !changes.transitioning)
            this.overflowShown = this.expanded;
    }

    resolveMatType()
    {
        if (!this.item) return '';
        if (this.item.itemType)
            return this.item.itemType;
        if (this.item.classifyType)
            return this.item.classifyType;
        return '';
    }

    resolveMatDropRateColor(rate: string)
    {
        let base = 0;
        let isWhite = false;
        if (rate !== 'N/A%' && rate !== '0%')
        {
            const rateNum = parseFloat(rate.slice(0, -1));
            base = Math.floor(rateNum);
        }
        if (base >  160) base = 160;
        if (base < 25) isWhite = true;
        return {
            fg: isWhite ? '#fff' : '#000',
            bg: `hsl(${base}, 92%, 52%)`
        };
    }

    processAvailability(item: ItemMaterial)
    {
        const out = [];
        if (item.stageDropList.length)
            out.push('Drop rate %')
        if (item.buildingProductList.length)
            out.push('Formula ID');
        return out.join('\u2009|\u2009');
    }

    overflowShown = false;
    toggleExpand() {
        if (this.transitioning || this.loading) return;
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
