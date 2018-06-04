import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PageService} from '../../../services';
import {ResourceComponent} from '../../resource';

@Component({
    selector: 'sitemap-list',
    templateUrl: './sitemap-list.component.html',
})
export class SitemapListComponent extends ResourceComponent implements OnInit {

    selectedLocale: string;
    @Output() changeLocale = new EventEmitter<any>();

    constructor(protected dataService: PageService) {
        super();
    }

    onChangeLocale() {
        this.changeLocale.emit(this.selectedLocale);
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedLocale = this.config.params.intl.default;
        this.onChangeLocale();
    }

    get locales() {
        return this.config.params.intl.locales;
    }

    drop(event: any) {
        this.models$.subscribe(
            (items) => {
                this.dataService.saveSort(this.getInfo(event.value.sitemap.id, items, null)).subscribe();
            }
        );
    }

    drag(event: any) {
    }

    protected getInfo(searchId: string, items: any, parent: string): { id: string, parent: string, prevSibling: string } {
        let prevSibling: string = null;
        for (let item of items) {
            if (item.sitemap.id === searchId) {
                return {
                    parent: parent,
                    prevSibling: prevSibling,
                    id: searchId,
                };
            }
            prevSibling = item.sitemap.id;
        }

        let result: { id: string, parent: string, prevSibling: string } = null;
        for (let item of items) {
            result = this.getInfo(searchId, item.children, item.sitemap.id);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }
}
