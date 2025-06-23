import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { Timelinewidget } from './components/timelinewidget';
import { Treewidget } from './components/treewidget';
import { ButtonWidget } from "./components/appbuttonwidget";


@Component({
    selector: 'app-home',
    imports: [Treewidget, Timelinewidget, ButtonWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- <app-stats-widget class="contents" /> -->
            <div class="col-span-12 xl:col-span-6">
                <app-button-widget/>
                <app-timeline-widget />
                <!-- <app-best-selling-widget /> -->
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-tree-widget />
            </div>
        </div>
    `
})
export class Home {}
