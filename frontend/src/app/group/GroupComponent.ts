import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { Treewidget } from "./treewidget";
import { GroupDetailsWidget } from "./group-details-widget";
import { GroupChatComponent } from "../components/GroupChatComponent";

@Component({
    selector: 'app-group',
    standalone: true,
    imports: [CommonModule,SplitterModule,FormsModule,DialogModule,FileUploadModule,ButtonModule,Treewidget,GroupDetailsWidget,GroupChatComponent],
    template: `
    <div class="card" style="height: 100vh; width: 100vw;">
    <p-splitter [style]="{ height: '100%', width: '100%' }" [panelSizes]="[33, 67]" [minSizes]="[10, 0]" styleClass="mb-8 h-full">
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full">
                <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"></app-group-details-widget>
            </div>
        </ng-template>
        <ng-template pTemplate="panel">
        <div class="flex flex-col h-full min-h-0 w-full"> <!-- Added min-h-0 -->
            <app-group-chat-widget [groupId]="groupId" class="flex-grow w-full"></app-group-chat-widget>
        </div>
        </ng-template>
        <ng-template pTemplate="panel">
                <p-splitter layout="vertical" [panelSizes]="[50, 50]">
                    <ng-template pTemplate="panel">
                        <div style="flex-grow: 1;" class="flex items-center justify-center">Panel 2</div>
                    </ng-template>
                    <ng-template pTemplate="panel">
                        <p-splitter [panelSizes]="[50, 50]">
                            <ng-template pTemplate="panel">
                                <div class="flex flex-col h-full p-4">
                                    <h3 class="text-xl font-semibold mb-3">Group Members</h3>
                                    <div class="flex-grow overflow-auto">
                                        <app-tree-widget #treeWidget [groupId]="groupId"></app-tree-widget>
                                    </div>
                                </div>
                            </ng-template>
                            <!-- <ng-template pTemplate="panel">
                                <div class="col flex items-center justify-center">Panel 4</div>
                            </ng-template> -->
                        </p-splitter>
                    </ng-template>
                </p-splitter>
        </ng-template>
        </p-splitter>
    </div>

    `
})
export class GroupComponent implements OnInit {
    groupId!: number;
    @ViewChild('treeWidget') treeWidget!: Treewidget;
    constructor(private route: ActivatedRoute) {}
    ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    }
    onMembershipChanged() { this.treeWidget.loadStatus();  // This reloads the tree to reflect the member list update
    }

}
