import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { Treewidget } from "./GroupInfo/treewidget";
import { GroupDetailsWidget } from "./GroupInfo/group-details-widget";
import { GroupChatComponent } from "../components/GroupChatComponent";
import { PollResponse } from "../services/poll.service";
import { PollListComponent } from "./Poll/PollListComponent";
import { GroupeService } from "../services/GroupeService";

@Component({
    selector: 'app-group',
    standalone: true,
    imports: [CommonModule,SplitterModule,FormsModule,DialogModule,FileUploadModule,ButtonModule,Treewidget,GroupDetailsWidget,
        GroupChatComponent,PollListComponent],
    template: `
    <div class="card" style="height: 100vh; width: 100vw;" *ngIf="canSee">
    <p-splitter [style]="{ height: '100%', width: '100%' }" [panelSizes]="[40, 67]" [minSizes]="[40, 30]" styleClass="mb-8 h-full">
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full">
                <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"></app-group-details-widget>
                <img src="https://img.myloview.com/murals/strichfiguren-strichmannchen-familie-teamwork-puzzle-nr-373-400-159980606.jpg" alt="groups"
                class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105">
                <div class="flex flex-col h-full justify-center items-center p-4 text-center">
                    <div class="flex items-center justify-center mb-6">
                        <div class="h-0.5 w-20 bg-gradient-to-r from-amber-200 to-orange-500 mr-4"></div>
                            <span class="text-orange-500 font-extrabold text-2xl select-none">Uncover Group Members</span>
                        <div class="h-0.5 w-20 bg-gradient-to-l from-amber-200 to-orange-500 ml-4"></div>
                    </div>
                <div class="flex-grow overflow-auto">
                    <app-tree-widget #treeWidget [groupId]="groupId"></app-tree-widget>
                </div>
                </div>
            </div>
        </ng-template>
        <ng-template pTemplate="panel">
        <div class="flex flex-col h-full w-full" style="min-height: 0;">
            <app-group-chat-widget class="flex-grow h-full w-full"[groupId]="groupId" (pollCreated)="onPollCreated($event.poll, $event.type)" ></app-group-chat-widget>
        </div>
        </ng-template>
        <ng-template pTemplate="panel">
                <p-splitter layout="vertical" [panelSizes]="[50, 50]" [minSizes]="[50, 50]" >
                    <ng-template pTemplate="panel">
                        <div class="flex flex-col h-full min-h-0 w-full p-4">
                            <app-poll-list [groupId]="groupId"></app-poll-list>
                        </div>
                    </ng-template>
                    <!-- <ng-template pTemplate="panel">
                        <p-splitter [panelSizes]="[50, 50]" >
                            <ng-template pTemplate="panel">
                                <div class="col flex items-center justify-center">Panel 4</div>
                            </ng-template>
                        </p-splitter>
                    </ng-template> -->
                </p-splitter>
        </ng-template>
        </p-splitter>
    </div>
    <p-dialog [visible]="!canSee" [modal]="true" [closable]="false" [draggable]="false" header="Accès en attente" [style]="{ width: '40vw' }">
        <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"> </app-group-details-widget>
    </p-dialog>
    `,
    styles: [`

    ::ng-deep .p-splitter-gutter {
        background-color:  #fde68a !important; /* amber-500 */
        box-shadow: inset 0 0 0 1px #facc15; /* amber-600 for contrast */
        border: none !important;
        width: 1px !important;
    }

    ::ng-deep .p-splitter {
        border: 1px solid  #fde68a !important; /* amber-500 */
        border-radius: 0.5rem;
    }
    ::ng-deep .p-splitter .p-splitter {
        border: none !important;
    }

    `]
})
export class GroupComponent implements OnInit {
    groupId!: number;
    selectedPollId?: number;
    selectedPollType?: string;
    canSee: boolean = false;

    @ViewChild('treeWidget') treeWidget!: Treewidget;
    @ViewChild(PollListComponent) pollListComponent!: PollListComponent;

    constructor(private route: ActivatedRoute , private groupeService: GroupeService) {}
    ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    this.checkUserRole();
    }
    onMembershipChanged() { this.treeWidget.loadStatus();  // This reloads the tree to reflect the member list update
    }

    checkUserRole() {
  this.groupeService.getGroupMembersByRole(this.groupId).subscribe({
    next: rolesMap => {
      console.log('Roles map:', rolesMap);
      const allRoles = Object.entries(rolesMap)
        .filter(([role, users]: [string, any]) =>
          users.some((u: any) => u.username === sessionStorage.getItem('username'))
        )
        .map(([role]) => role);
      console.log('User roles:', allRoles);
      this.canSee = allRoles.length > 0 && allRoles.some(role => role !== 'en_attente')
      console.log('canSee:', this.canSee);
    },
    error: err => {
      console.error('Failed to fetch group roles', err);
      this.canSee = false;
    }
  });
}

    onPollCreated(poll: PollResponse, type: string) {
        this.pollListComponent?.loadPolls();
    }

}
