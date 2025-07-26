import { Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { PollService, PollResponse } from '../../services/poll.service';
import { CommonModule } from '@angular/common';
import { PollDisplayComponent } from './PollDisplayComponent';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-poll-list',
    standalone: true,
    imports: [FormsModule,CommonModule, PollDisplayComponent, CarouselModule,SelectButtonModule],
    template: `
        <div style="padding: 1rem; max-width: 900px; margin: auto;">
            <div class="flex justify-center mb-4">
                <!-- can you transform this the togglebutton :
                <p-toggleButton class="my-toggle" [(ngModel)]="showClosedPolls" onLabel="Recently Closed Polls" offLabel="Vote Now : Latest Polls"> </p-toggleButton>
                to selected button? -->
                <div class="custom-select-button"[ngStyle]="{ border: '2px solid #7db4e8', 'border-radius': '8px', padding: '0 em',width: '29em' }">
                    <button *ngFor="let option of selectButtonValues" (click)="selectButtonValue = option.value"
                        [class.selected]="selectButtonValue === option.value" [class.default]="selectButtonValue !== option.value" >
                        {{ option.label }}
                    </button>
                </div>

            </div>
            <div class="text-center text-sm text-slate-500 mt-1"> Switch between Active and Closed Polls</div>
            <ng-container *ngIf="showClosedPolls; else activePollsTemplate">
                <ng-container *ngIf="closedPolls.length; else noPolls">
                    <p-carousel [value]="closedPolls" [numVisible]="1" [numScroll]="1" [circular]="true" [autoplayInterval]="0" [showIndicators]="true"[style.margin]="'auto'">
                        <ng-template let-poll pTemplate="item">
                            <div class="poll-card" style="margin: 0 0.1rem;">
                                <app-poll-display [pollId]="poll.id" [pollType]="getPollType(poll)" [groupId]="groupId" [readonly]="true"> </app-poll-display>
                            </div>
                        </ng-template>
                    </p-carousel>
                </ng-container>
            </ng-container>

            <ng-template #activePollsTemplate>
                <ng-container *ngIf="polls.length; else noPolls">
                <p-carousel [value]="polls" [numVisible]="1" [numScroll]="1" [circular]="true" [autoplayInterval]="0" [showIndicators]="true" [style.margin]="'auto'">
                    <ng-template let-poll pTemplate="item">
                    <div class="poll-card" style="margin: 0 0.1rem;">
                        <app-poll-display [pollId]="poll.id" [pollType]="getPollType(poll)" [groupId]="groupId" (pollDeleted)="loadPolls()"> </app-poll-display>
                    </div>
                    </ng-template>
                </p-carousel>
                </ng-container>
            </ng-template>

            <ng-template #noPolls>
                <img src="assets/images/Nopolls.png" alt="Nopolls" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
            </ng-template>
        </div>
    `,
    styles: [`
        .custom-select-button { display: flex; justify-content: center; width: '14.5em' }
        .custom-select-button button { flex: 1; text-align: center; font-size: 1rem; padding: 0.5em 1em;
            border-radius: 4px; font-weight: 800; border: 0px solid; transition: all 0.3s ease; }
        .custom-select-button button.selected { background: linear-gradient(to right, #bfdbfe, #93c5fd, #bfdbfe);
            color:#2563eb; border-color:  transparent; }
        .custom-select-button button.default { background: #60a5fa; border-color:  transparent; background-clip: text;
            -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }

    //     .my-toggle.p-togglebutton.p-highlight {
    //     background-color: white !important;
    //     color: #78a9d6ff !important;
    //     border: 2px solid #7db4e8ff !important;
    //     }
    //     .my-toggle.p-togglebutton {
    //     background-color: white !important;
    //     color: #78a9d6ff !important;
    //     border: 2px solid #7db4e8ff !important;
    //     }
    //     .my-toggle {
    //     font-size: 1.5rem !important;
    //     width: 19em !important;  /* or width: 300px !important; */
    //     }
//        /* Force blue indicators globally */
//             ::ng-deep .custom-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
//   background-color: #3b82f6 !important;
// }
    `]

})
export class PollListComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollType!: string;

    polls: PollResponse[] = [];
    closedPolls: PollResponse[] = [];
    // showClosedPolls = false;
    showCreatePopup = false;
    ////////
    selectButtonValues = [
        { label: 'Vote Now: Latest Polls', value: 'open' },
        { label: 'Recently Closed Polls', value: 'closed' }
    ];
    selectButtonValue = 'open';

    constructor(private pollService: PollService) {}


    ngOnInit() {
        this.loadPolls();
        this.pollService.getClosedPollsByGroup(this.groupId).subscribe(closed => {
            this.closedPolls = closed;
        });
    }
//////////
    get showClosedPolls(): boolean {
        return this.selectButtonValue === 'closed';
    }


    loadPolls() {
        this.pollService.getPollsByGroup(this.groupId).subscribe(polls => {
        this.polls = polls;
        });
    }

    getPollType(poll: PollResponse): string {
    if (poll.choices && poll.choices.length === 5 && poll.choices.every(c => /^\d+$/.test(c.text))) {
        return 'rating';
    }
    return 'non-rating';
    }

}
