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
import { PollDisplayComponent } from "./Poll/PollDisplayComponent";
import { PollResponse } from "../services/poll.service";
import { PollListComponent } from "./Poll/PollListComponent";

@Component({
    selector: 'app-group',
    standalone: true,
    imports: [CommonModule,SplitterModule,FormsModule,DialogModule,FileUploadModule,ButtonModule,Treewidget,GroupDetailsWidget,
        GroupChatComponent,PollDisplayComponent,PollListComponent],
    template: `
    <div class="card" style="height: 100vh; width: 100vw;">
    <p-splitter [style]="{ height: '100%', width: '100%' }" [panelSizes]="[33, 67]" [minSizes]="[30, 30]" styleClass="mb-8 h-full">
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full">
                <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"></app-group-details-widget>
                <img src="https://tse1.mm.bing.net/th/id/OIP.h-0Apw6VgGG4mP1AbCj_TgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" alt="groups" class="mb-0">
                <div class="flex flex-col h-full justify-center items-center p-4 text-center">
                    <div class="border border-gray-400 rounded-lg px-4 py-2 bg-white shadow-sm flex justify-center items-center w-full">
                        <h3 class="text-2xl font-semibold  italic text-gray-600 flex items-center gap-2  mt-0"> Uncover Group Members</h3>
                    </div>
                    <div class="flex-grow overflow-auto">
                        <app-tree-widget #treeWidget [groupId]="groupId"></app-tree-widget>
                    </div>
                </div>
            </div>
        </ng-template>

        <ng-template pTemplate="panel">
        <div class="flex flex-col h-full min-h-0 w-full">
            <app-group-chat-widget [groupId]="groupId" class="flex-grow w-full" (pollCreated)="onPollCreated($event.poll, $event.type)"></app-group-chat-widget>
        </div>
        </ng-template>
        <ng-template pTemplate="panel">
                <p-splitter layout="vertical" [panelSizes]="[50, 50]" [minSizes]="[50, 50]">
                    <ng-template pTemplate="panel">
                        <div class="flex flex-col h-full min-h-0 w-full p-4">
                            <app-poll-list [groupId]="groupId"></app-poll-list>
                            <app-poll-display *ngIf="selectedPollId && selectedPollType" [pollId]="selectedPollId"
                            [pollType]="selectedPollType" [groupId]="groupId"> </app-poll-display>
                        </div>
                    </ng-template>
                    <ng-template pTemplate="panel">
                        <p-splitter [panelSizes]="[50, 50]">
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
    selectedPollId?: number;
    selectedPollType?: string;

    @ViewChild('treeWidget') treeWidget!: Treewidget;
    constructor(private route: ActivatedRoute) {}
    ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    }
    onMembershipChanged() { this.treeWidget.loadStatus();  // This reloads the tree to reflect the member list update
    }
    onPollCreated(poll: PollResponse, type: string) {
    this.selectedPollId = poll.id;
    this.selectedPollType = type;
    }

}
