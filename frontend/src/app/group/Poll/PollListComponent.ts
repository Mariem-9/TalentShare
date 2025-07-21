import { Component, Input, OnInit} from '@angular/core';
import { PollService, PollResponse } from '../../services/poll.service';
import { CommonModule } from '@angular/common';
import { PollDisplayComponent } from './PollDisplayComponent';
import { CarouselModule } from 'primeng/carousel';
import { ToggleButton } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-poll-list',
    standalone: true,
    imports: [FormsModule,CommonModule, PollDisplayComponent, CarouselModule, ToggleButton],
    template: `
        <div style="padding: 1rem; max-width: 900px; margin: auto;">
            <div class="flex justify-center mb-4">
                <p-toggleButton class="my-toggle" [(ngModel)]="showClosedPolls" onLabel="Recently Closed Polls" offLabel="Vote Now : Latest Polls"> </p-toggleButton>
            </div>
            <div style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.25rem;"> Click to toggle between Active and Closed polls </div>
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
                <img src="https://thumbs.dreamstime.com/b/stick-figures-isolated-white-background-hand-drawn-doodle-line-art-cartoon-design-character-stick-figures-hand-drawn-doodle-279022106.jpg"
                alt="No polls" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
            </ng-template>
        </div>
    `,
    styles: [`
        .my-toggle.p-togglebutton.p-highlight {
        background-color: white !important;
        color: #a4a1a1ff !important;
        border: 2px solid #E2E2E2 !important;
        }

        .my-toggle.p-togglebutton {
        background-color: white !important;
        color: #a4a1a1ff !important;
        border: 2px solid #E2E2E2 !important;
        }
        .my-toggle {
        font-size: 1.5rem !important;
        width: 19em !important;  /* or width: 300px !important; */
        }
    `]

})
export class PollListComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollType!: string;

    polls: PollResponse[] = [];
    closedPolls: PollResponse[] = [];
    showClosedPolls = false;
    showCreatePopup = false;

    constructor(private pollService: PollService) {}

    ngOnInit() {
        this.loadPolls();
        this.pollService.getClosedPollsByGroup(this.groupId).subscribe(closed => {
            this.closedPolls = closed;
        });
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
