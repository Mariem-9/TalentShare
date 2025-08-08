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
    <p-splitter [style]="{ height: '100%', width: '100%' }" [panelSizes]="[45, 52]" [minSizes]="[45, 52]" styleClass="mb-8 h-full">
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full">
                <app-group-details-widget [groupId]="groupId" (membershipChanged)="onMembershipChanged()"></app-group-details-widget>
                <img src="assets/images/groups.png" alt="groups" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105" />
                <div class="flex flex-col h-full justify-center items-center p-4 text-center">
                    <div class="w-[470px] mx-auto  flex flex-col items-center justify-center mb-2 border border-blue-200 rounded-md p-2">
                        <p class="text-2xl font-semibold text-gray-800 mb-0">Network</p>
                        <p class="text-md text-gray-500 mt-0">Connecting talents . sharing visions.</p>
                    </div>
                <div class="flex-grow overflow-auto">
                    <app-tree-widget #treeWidget [groupId]="groupId"></app-tree-widget>
                </div>
                </div>
            </div>
        </ng-template>
        <ng-template pTemplate="panel">
        <div class="flex flex-col h-full w-full  chat-background-pattern" style="min-height: 0;">
            <app-group-chat-widget class="flex-grow h-full w-full"[groupId]="groupId" (pollCreated)="onPollCreated($event.poll, $event.type)" (momentPublishedEvent)="reloadMoments()" ></app-group-chat-widget>
        </div>
        </ng-template>
        <ng-template pTemplate="panel">
            <div class="flex flex-col h-full overflow-y-auto overflow-x-hidden">
                <p-splitter layout="vertical" [panelSizes]="[50, 50]" [minSizes]="[50, 50]" >
                    <ng-template pTemplate="panel">
                        <div class="flex flex-col h-full min-h-0 w-full p-4 ">
                            <app-poll-list [groupId]="groupId"></app-poll-list>

                        </div>
                    </ng-template>
                    <ng-template pTemplate="panel">
                        <div class="flex flex-col h-full min-h-0 w-full p-4 ">
                            <app-moment-carousel [groupeId]="groupId"></app-moment-carousel>
                        </div>
                    </ng-template>
                </p-splitter>
            </div>
        </ng-template>
        </p-splitter>
    </div>
    <button *ngIf="showBackToHome" (click)="goHome()" pButton icon="pi pi-home" label="Home"
        style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 97%;
        background: linear-gradient(to right, #bfdbfe, #93c5fd, #60a5fa, #93c5fd, #bfdbfe); color: white; font-weight: bold; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);border: 2px solid #60a5fa;"
        type="button"></button>


    `,
    styles: [`

    .chat-background-pattern {
    background-image:
        radial-gradient(circle 20px at 10px 20px, #dbeafe 15%, transparent 16%),
        radial-gradient(circle 20px at 30px 0, #dbeafe 15%, transparent 16%);
    background-size: 20px 20px;
    background-repeat: repeat;
    }

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
