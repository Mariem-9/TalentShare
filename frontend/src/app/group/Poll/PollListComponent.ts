import { Component, Input, OnInit} from '@angular/core';
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
        <div class="w-[400px] mx-auto  flex flex-col items-center justify-center mb-2 border border-blue-200 rounded-md p-2">
            <p class="text-2xl font-semibold text-gray-800 mb-0">Polls</p>
            <p class="text-md text-gray-500 mt-0">Vote. Share. Decide.</p>
        </div>
        <div style="padding: 1rem; max-width: 490px; margin: auto;">
            <div class="flex justify-center mb-4">

                <div class="custom-select-button"[ngStyle]="{ border: '2px solid #cdcdcdff', 'border-radius': '8px', padding: '0 em',width: '29em' }">
                    <button *ngFor="let option of selectButtonValues" (click)="selectButtonValue = option.value"
                        [class.selected]="selectButtonValue === option.value" [class.default]="selectButtonValue !== option.value" >
                        {{ option.label }}
                    </button>
                </div>

            </div>
            <div class="text-center text-md text-slate-500 mt-1"> Switch between Active and Closed Polls</div>
            <ng-container *ngIf="showClosedPolls; else activePollsTemplate">
                <ng-container *ngIf="closedPolls.length; else noPolls">
                    <p-carousel [value]="closedPolls" [numVisible]="1" [numScroll]="1" [circular]="false" [autoplayInterval]="0" [showIndicators]="true"[style.margin]="'auto'">
                        <ng-template let-poll pTemplate="item">
                            <div class="poll-card" style="margin: 0 0.1rem;">
                                <app-poll-display [pollId]="poll.id" [pollType]="getPollType(poll)" [groupId]="groupId"
                                [readonly]="true" [creatorUsername]="poll.creatorUsername" [currentUsername]="currentUsername"> </app-poll-display>
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
                        <app-poll-display [pollId]="poll.id" [pollType]="getPollType(poll)" [groupId]="groupId"
                        [creatorUsername]="poll.creatorUsername" [currentUsername]="currentUsername" (pollDeleted)="loadPolls()"> </app-poll-display>
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
        .custom-select-button {
            display: flex;
            justify-content: center;
            width: 14.5em;
        }

        .custom-select-button button {
            flex: 1;
            text-align: center;
            font-size: 1rem;
            padding: 0.5em 1em;
            border-radius: 4px;
            font-weight: 800;
            border: 0px solid;
            transition: all 0.3s ease;
        }

        .custom-select-button button.selected {
            background: linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb); /* very soft grays */
            color: #6f6d6dff; /* soft dark gray text */
            border-color: transparent;
        }

        .custom-select-button button.default {
            background: #d1d5db; /* light gray */
            border-color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
        }
    `]

})
export class PollListComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollType!: string;
    currentUsername!: string;
    polls: PollResponse[] = [];
    closedPolls: PollResponse[] = [];
    // showClosedPolls = false;
    selectButtonValues = [
        { label: 'Vote Now: Latest Polls', value: 'open' },
        { label: 'Recently Closed Polls', value: 'closed' }
    ];
    selectButtonValue = 'open';

    constructor(private pollService: PollService) {}


    ngOnInit() {
        this.currentUsername = sessionStorage.getItem('username') || '';
        this.loadPolls();
        this.pollService.getClosedPollsByGroup(this.groupId).subscribe(closed => {
            this.closedPolls = closed;
        });
    }

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
