import { Component } from '@angular/core';
import { NestedMenuComponent } from '../../components/nested-menu-items.component';
@Component({
    selector: 'app-home',
    imports: [NestedMenuComponent],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 xl:col-span-6">
                <!-- <app-timeline-widget /> -->
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-nested-menu/>
                <!-- <app-tree-widget /> -->
            </div>
        </div>
    `
})
export class Home {
}
