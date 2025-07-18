import { Component, Input, OnInit } from '@angular/core';
import { PollService, PollResponse } from '../../services/poll.service';
import { CommonModule } from '@angular/common';
import { PollDisplayComponent } from './PollDisplayComponent';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'app-poll-list',
    standalone: true,
    imports: [CommonModule, PollDisplayComponent, CarouselModule],
    template: `
        <div style="padding: 1rem;">
            <h2 style="text-align: center; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem;">
                Vote Now: Latest Polls
            </h2>
            <ng-container *ngIf="polls.length; else noPolls">
                <p-carousel [value]="polls" [numVisible]="1" [numScroll]="1" [circular]="true" [autoplayInterval]="0" [showIndicators]="true" [style.max-width.px]="900" [style.margin]="'auto'">
                    <ng-template let-poll pTemplate="item">
                        <div class="poll-card" style="margin: 0 0.25rem;">
                            <app-poll-display [pollId]="poll.id" [pollType]="getPollType(poll)" [groupId]="groupId" (pollDeleted)="loadPolls()"> </app-poll-display>
                        </div>
                    </ng-template>
                </p-carousel>
            </ng-container>

            <ng-template #noPolls>
                <p style="text-align: center; font-style: italic; color: #555;"> Nothing to vote on yet. Keep an eye out for new polls! </p>
                    <img src="https://tse2.mm.bing.net/th/id/OIP.WNBQXo_7IkV7nSecEczURQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" alt="No polls" >
            </ng-template>
        </div>
    `
})
export class PollListComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollType!: string;

    polls: PollResponse[] = [];

    constructor(private pollService: PollService) {}

    ngOnInit() {
        this.loadPolls();
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
