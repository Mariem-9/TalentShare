import { Component, Input, OnInit } from '@angular/core';
import { PollService, PollResponse } from '../services/poll.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-poll-display',
    standalone: true,
    imports: [CommonModule, FormsModule, RatingModule, ButtonModule,RadioButtonModule,BadgeModule],
    template: `
    <div *ngIf="poll" class="card flex flex-col gap-4 p-4 shadow-md rounded-md max-w-md mx-auto">
        <div class="font-semibold text-xl mb-3">Poll Question : {{ poll.question }}</div>
        <div class="mb-2 text-sm font-normal text-gray-500">Make your choice below:</div>
        <div *ngIf="pollType !== 'rating'">
            <div class="flex flex-col gap-3">
            <div *ngFor="let choice of poll.choices; let i = index" class="flex items-center justify-between">
                <div class="flex items-center">
                <p-radiobutton [inputId]="'option' + i" name="pollChoices" [value]="choice.id" [(ngModel)]="selectedChoice" [disabled]="voted"></p-radiobutton>
                <label [for]="'option' + i" class="ml-2">{{ choice.text }}</label>
                </div>
                <p-badge [value]="choice.voteCount" [severity]="getRandomSeverity(i)" class="ml-4"></p-badge>
            </div>
            </div>
        </div>
        <div *ngIf="pollType === 'rating'" class="flex flex-col gap-4">
            <p-rating [(ngModel)]="ratingValue" [disabled]="voted"></p-rating>
        </div>
        <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-500">
                <i class="pi pi-calendar"></i> Closing Date: {{ poll.endDate | date: 'medium' }}
            </div>
            <button pButton type="button" icon="pi pi-inbox" class="p-button p-button-sm p-button-outlined p-button-success"
                (click)="pollType === 'rating' ? submitRating() : vote(selectedChoice)"
            [disabled]=" voted || (pollType === 'rating' ? ratingValue === 0 : !selectedChoice) " aria-label="Submit vote" > Vote </button>
        </div>
    </div>
`
})
export class PollDisplayComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollId!: number;
    @Input() pollType!: string;


    poll?: PollResponse;
    voted = false;
    ratingValue = 0;
    averageRating = 0;
    selectedChoice: number | null = null;
    badgeSeverities: Array<'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'> = [
    'success',
    'info',
    'warn',
    'danger',
    'secondary',
    'contrast',
    ];

    constructor(private pollService: PollService) {}

    ngOnInit() {
        this.loadPoll();
    }

    getRandomSeverity(index: number): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    return this.badgeSeverities[index % this.badgeSeverities.length];
    }

    loadPoll() {
        this.pollService.getResults(this.pollId).subscribe(poll => {
        this.poll = poll;

        if (this.pollType === 'rating') {
            this.calculateAverageRating();
        }
        });
    }

    vote(choiceId: number | null) {
    if (this.voted) return;
    if (choiceId === null || choiceId === undefined) {
        console.error('No choice selected');
        return;
    }
    this.pollService.vote(this.pollId, choiceId).subscribe(() => {
        this.voted = true;
        this.loadPoll(); // refresh results
    });
    }

    submitRating() {
    if (this.voted || this.ratingValue === 0 || !this.poll) return;

    const choice = this.poll.choices.find(c => c.text === this.ratingValue.toString());
    if (!choice) {
        console.error("Rating choice not found");
        return;
    }

    this.pollService.vote(this.pollId, choice.id).subscribe(() => {
        this.voted = true;
        this.loadPoll();
    });
    }



    calculateAverageRating() {
        if (!this.poll) return;

        let totalVotes = 0;
        let weightedSum = 0;

        this.poll.choices.forEach(choice => {
        const rating = parseInt(choice.text, 10);
        weightedSum += rating * choice.voteCount;
        totalVotes += choice.voteCount;
        });

        this.averageRating = totalVotes ? parseFloat((weightedSum / totalVotes).toFixed(2)) : 0;

    }
    }
