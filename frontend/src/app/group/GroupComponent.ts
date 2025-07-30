import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MomentCarouselComponent } from "./Moment/MomentListComponent";
@Component({
    selector: 'app-group',
    standalone: true,
    imports: [CommonModule,SplitterModule,FormsModule,DialogModule,FileUploadModule,ButtonModule,Treewidget,GroupDetailsWidget,
        GroupChatComponent,PollListComponent,MomentCarouselComponent],
    template: `
    <div class="card" style="height: 100vh; width: 100vw;" >
    <p-splitter [style]="{ height: '100%', width: '100%' }" [panelSizes]="[40, 67]" [minSizes]="[40, 30]" styleClass="mb-8 h-full">
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full">
                <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"></app-group-details-widget>
                <img src="assets/images/groups.png" alt="groups" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105" />
                <div class="flex flex-col h-full justify-center items-center p-4 text-center">
                    <div class="flex items-center justify-center mb-6">
                        <div class="h-0.5 w-20 bg-gradient-to-r from-blue-200 to-blue-400 mr-4"></div>
                            <span class="text-blue-500 font-extrabold text-2xl select-none">Uncover Group Members</span>
                        <div class="h-0.5 w-20 bg-gradient-to-l from-blue-200 to-blue-400 ml-4"></div>
                    </div>
                <div class="flex-grow overflow-auto">
                    <app-tree-widget #treeWidget [groupId]="groupId"></app-tree-widget>
                </div>
                </div>
            </div>
        </ng-template>
        <ng-template pTemplate="panel">
        <div class="flex flex-col h-full w-full" style="min-height: 0;">
            <app-group-chat-widget class="flex-grow h-full w-full"[groupId]="groupId" (pollCreated)="onPollCreated($event.poll, $event.type)" (momentPublishedEvent)="reloadMoments()" ></app-group-chat-widget>
        </div>
        </ng-template>
        <ng-template pTemplate="panel">
                <p-splitter layout="vertical" [panelSizes]="[50, 50]" [minSizes]="[50, 50]" >
                    <ng-template pTemplate="panel">
                        <div class="flex flex-col h-full min-h-0 w-full p-4">
                            <app-poll-list [groupId]="groupId"></app-poll-list>

                        </div>
                    </ng-template>
                    <ng-template pTemplate="panel">
  <div class="flex flex-col h-full min-h-0 w-full p-4">
    <app-moment-carousel [groupeId]="groupId"></app-moment-carousel>
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
    <button *ngIf="showBackToHome" (click)="goHome()" pButton icon="pi pi-home" label="Home"
        style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 97%;
        background: linear-gradient(to right, #bfdbfe, #93c5fd, #60a5fa, #93c5fd, #bfdbfe); color: white; font-weight: bold; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);border: 2px solid #60a5fa;"
        type="button"></button>


    `,
    styles: [`

    ::ng-deep .p-splitter-gutter {
        background-color:  	#93c5fd !important;
        box-shadow: inset 0 0 0 2px #93c5fd;
        border: none !important;
        width: 1px !important;
    }

    ::ng-deep .p-splitter {
        border: 1px solid  	#93c5fd !important;
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
    showBackToHome = false;

    @ViewChild('treeWidget') treeWidget!: Treewidget;
    @ViewChild(PollListComponent) pollListComponent!: PollListComponent;
    @ViewChild(MomentCarouselComponent) momentCarousel!: MomentCarouselComponent;

    constructor(private route: ActivatedRoute , private groupeService: GroupeService ,private router: Router) {}
    ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Group ID from route:', this.groupId);
    }
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.showBackToHome = event.clientY <= 50;
    }
    goHome() {
        this.router.navigate(['/home']);
    }
    onMembershipChanged() { this.treeWidget.loadStatus();
    }

    onPollCreated(poll: PollResponse, type: string) {
        this.pollListComponent?.loadPolls();
    }
    reloadMoments() {
        this.momentCarousel.loadMoments();
    }



}
