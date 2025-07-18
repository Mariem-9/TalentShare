import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PollService, PollResponse } from '../../services/poll.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BadgeModule } from 'primeng/badge';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PopoverModule } from 'primeng/popover';
import { FloatLabelModule } from 'primeng/floatlabel';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'app-poll-display',
    standalone: true,
    imports: [CommonModule, FormsModule, RatingModule, ButtonModule,RadioButtonModule,BadgeModule,ConfirmDialogModule,
                ToastModule, InputTextModule, CalendarModule,PopoverModule,FloatLabelModule],
    template: `
    <div *ngIf="poll" class="card flex flex-col gap-4 p-4 shadow-md rounded-md max-w-md mx-auto">
    <div class="font-semibold text-xl mb-3 flex justify-between items-center">
        <span>Poll Question: {{ poll.question }}</span>
        <div class="flex items-center gap-1">
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" #editBtn (click)="openEditPopup(); op.toggle($event)"></button>
            <button pButton class="p-button-text p-button-sm" (click)="confirmDelete()">
                <i class="pi pi-trash" style="color: red;"></i>
            </button>
        </div>
    </div>

    <div class="mb-2 text-sm font-normal text-gray-500">Make your choice below:</div>

    <div *ngIf="pollType !== 'rating'">
        <div class="flex flex-col gap-3">
            <div *ngFor="let choice of poll.choices; let i = index" class="flex items-center justify-between">
                <div class="flex items-center">
                    <p-radiobutton [inputId]="'option' + i" name="pollChoices" [value]="choice.id" [(ngModel)]="selectedChoice" [disabled]="!editing && voted"></p-radiobutton>
                    <label [for]="'option' + i" class="ml-2">{{ choice.text }}</label>
                </div>
                <p-badge [value]="choice.voteCount" [severity]="getRandomSeverity(i)" class="ml-4"></p-badge>
            </div>
        </div>
    </div>

    <div *ngIf="pollType === 'rating'" class="flex flex-col gap-4">
        <p-rating [(ngModel)]="ratingValue" [disabled]="!editing && voted"></p-rating>
    </div>

    <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-500">
            <i class="pi pi-calendar"></i> Closing Date: {{ poll.endDate | date: 'medium' }}
        </div>
        <button
            pButton type="button" icon="pi pi-inbox"
            class="p-button p-button-sm p-button-outlined p-button-success"
            (click)="
                editing
                    ? submitEditedVote()
                    : voted
                    ? enableEditing()
                    : pollType === 'rating'
                    ? submitRating()
                    : vote(selectedChoice)
            "
            [disabled]="
                (editing && (pollType === 'rating' ? ratingValue === 0 : !selectedChoice)) ||
                (!editing && voted && pollType !== 'rating' && !selectedChoice)
                "

            aria-label="Submit vote"
        >
            {{ editing ? 'Vote' : voted ? 'Edit Vote' : 'Vote' }}
        </button>
    </div>
</div>


    <p-popover #op [style]="{ width: '400px' }" [dismissable]="true" (onHide)="onPopoverHide()">
        <div class="p-popover-header flex justify-between items-center mb-1 border-b pb-2 mt-1">
            <h3 class="text-lg font-bold"> {{ currentStep === 1 ? 'Edit Poll' : 'Edit Choices' }} </h3>
            <button type="button" class="p-button p-button-text p-button-sm" (click)="op.hide()" aria-label="Close"> <i class="pi pi-times"></i></button>
        </div>

        <div class="p-fluid flex flex-col gap-8 mt-8">
            <!-- Step 1: Poll Details -->
            <ng-container *ngIf="currentStep === 1">
                <p-floatLabel>
                    <input id="question" type="text" pInputText [(ngModel)]="pollQuestion" class="w-full" />
                    <label for="question">Poll Question</label>
                </p-floatLabel>
                <div class="flex gap-4 items-center">
                    <p-floatLabel>
                        <p-calendar [(ngModel)]="pollEndDate" [showIcon]="true" dateFormat="yy-mm-dd" inputId="endDate" class="w-full" ></p-calendar>
                        <label for="endDate">Closing Date</label>
                    </p-floatLabel>
                    <button pButton [label]="isLastStep ? 'Save' : 'Next'" class="p-button-primary" style="width: 200px;"(click)="isLastStep ? submitAll(op) : goToStep2(op)"></button>
                </div>
            </ng-container>
            <!-- Step 2: Poll Choices -->
            <ng-container *ngIf="currentStep === 2 && pollType !== 'rating'">
                <div *ngFor="let choice of pollChoices; let i = index" class="flex items-center gap-1">
                    <p-floatLabel class="flex-grow">
                        <input type="text" pInputText [(ngModel)]="choice.text" [readonly]="choice.hasVotes || isAfterEndDate"
                        [id]="'option' + (i + 1)" [style.backgroundColor]="(choice.hasVotes || isAfterEndDate) ? '#f0f0f0' : 'inherit'"
                        [style.color]="(choice.hasVotes || isAfterEndDate) ? '#6c6c6c' : 'inherit'"
                        [style.cursor]="(choice.hasVotes || isAfterEndDate) ? 'not-allowed' : 'auto'" class="w-full" />
                        <label [for]="'option' + (i + 1)">Option {{ i + 1 }}</label>
                    </p-floatLabel>
                    <button pButton class="p-button-text p-button-sm p-0" (click)="deleteChoice(choice)" [disabled]="choice.hasVotes || isAfterEndDate|| pollChoices.length <= 2">
                        <i class="pi pi-trash" style="color: red;"></i>
                    </button>
                </div>
                <button pButton label="Save All Changes Made" class="p-button-primary" (click)="submitAll(op)" ></button>
            </ng-container>
        </div>
    </p-popover>

    <p-confirmDialog header="Confirm Deletion" icon="pi pi-exclamation-triangle"></p-confirmDialog>

`,
styles: [`
    .p-calendar, .p-calendar .p-inputtext {
        width: 100% !important;
    }
    .custom-calendar .p-inputtext {
        width: 100% !important;
    }
    .p-float-label {
        display: block;
        width: 100%;
    }
    `]
,
providers: [ConfirmationService,MessageService]
})
export class PollDisplayComponent implements OnInit {
    @Input() groupId!: number;
    @Input() pollId!: number;
    @Input() pollType!: string;
    @Output() pollDeleted = new EventEmitter<void>();

    poll?: PollResponse;
    voted = false;
    ratingValue = 0;
    averageRating = 0;
    selectedChoice: number | null = null;
    badgeSeverities: Array<'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'> = [
    'success', 'info', 'warn', 'danger', 'secondary', 'contrast',];
    editing = false;
    pollQuestion = '';
    pollEndDate: Date = new Date();
    currentStep = 1;
    pollChoices: { id: number, text: string, hasVotes: boolean }[] = [];
    isAfterEndDate = false;
    originalChoices: { id: number, text: string }[] = [];
    isLastStep: boolean = false;

    constructor(private pollService: PollService , private confirmationService: ConfirmationService ,private messageService: MessageService) {}

    ngOnInit() {
        this.loadPoll();
    }

    getRandomSeverity(index: number): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    return this.badgeSeverities[index % this.badgeSeverities.length];
    }

    loadPoll() {
        this.pollService.getResults(this.pollId).subscribe(poll => {
        this.poll = poll;

        if (poll.votedChoiceId !== null && poll.votedChoiceId !== undefined) {
            this.voted = true;
            this.selectedChoice = poll.votedChoiceId;
            this.ratingValue = this.getRatingFromChoiceId(poll.votedChoiceId);
        }

        if (this.pollType === 'rating') {
            this.calculateAverageRating();
        }
        });
    }

    getRatingFromChoiceId(choiceId: number): number {
        const choice = this.poll?.choices.find(c => c.id === choiceId);
        return choice ? parseInt(choice.text, 10) : 0;
    }

    vote(choiceId: number | null) {
        if (this.voted && !this.editing) return;
        if (choiceId === null || choiceId === undefined) {
            console.error('No choice selected');
            return;
        }
        this.pollService.vote(this.pollId, choiceId).subscribe(() => {
            this.voted = true;
            this.editing = false;
            this.loadPoll();
        });
    }

    submitRating() {
        if (this.voted && !this.editing) return;
        if (this.ratingValue === 0 || !this.poll) return;

        const choice = this.poll.choices.find(c => c.text === this.ratingValue.toString());
        if (!choice) {
            console.error("Rating choice not found");
            return;
        }

        this.pollService.vote(this.pollId, choice.id).subscribe(() => {
            this.voted = true;
            this.editing = false;
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

    enableEditing() { this.editing = true; }

    submitEditedVote() {
        this.pollService.deleteVote(this.pollId).subscribe(() => {
            if (this.pollType === 'rating') {
            if (!this.poll) return;
        const choice = this.poll.choices.find(c => c.text === this.ratingValue.toString());
        if (!choice) {
        console.error("Rating choice not found");
        return;
        }
            this.pollService.vote(this.pollId, choice.id).subscribe(() => {
                this.voted = true;
                this.editing = false;
                this.loadPoll();
            });
            } else {
            if (this.selectedChoice === null) {
                console.error("No choice selected");
                return;
            }
            this.pollService.vote(this.pollId, this.selectedChoice).subscribe(() => {
                this.voted = true;
                this.editing = false;
                this.loadPoll();
            });
            }
        });
    }

    openEditPopup() {
        if (!this.poll) return;
        this.currentStep = 1;
        this.pollQuestion = this.poll.question;
        this.pollEndDate = new Date(this.poll.endDate);
    }

    onPopoverHide() {}

    goToStep2(op: any) {
        if (!this.pollQuestion.trim() || !this.pollEndDate) {
            this.messageService.add({
            severity: 'warn',
            summary: 'Incomplete',
            detail: 'Please fill out both question and end date.'
            });
            return;
        }
        if (this.pollType === 'rating') {
            this.isLastStep = true;
            this.submitAll(op); // Or auto-submit directly if needed
        } else {
            this.currentStep = 2;
            this.fetchPollChoices();

        }

    }

    fetchPollChoices() {
        this.isAfterEndDate = new Date() > new Date(this.pollEndDate);
        if (!this.poll?.choices) return;

        this.pollChoices = this.poll.choices.map(c => ({
            id: c.id,
            text: c.text,
            hasVotes: c.voteCount > 0
        }));

        this.originalChoices = JSON.parse(JSON.stringify(this.pollChoices));
    }

    deleteChoice(choice: any) {
        if (this.pollChoices.length <= 2 || choice.hasVotes || this.isAfterEndDate) return;

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this choice?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
            this.pollService.deleteChoice(choice.id).subscribe(() => {
                this.pollChoices = this.pollChoices.filter(c => c.id !== choice.id);
            });
            }
        });
    }

    submitAll(popover: any) {
        let deleteRequests: Observable<any>[] = [];
        let editRequests: Observable<any>[] = [];

        if (this.pollType !== 'rating') {
            const deletedChoiceIds = this.originalChoices
            .filter(orig => !this.pollChoices.some(c => c.id === orig.id))
            .map(c => c.id);

            const updatedChoices = this.pollChoices.filter(c => {
            const original = this.originalChoices.find(o => o.id === c.id);
            return original && original.text !== c.text;
            });

            deleteRequests = deletedChoiceIds.map(id => this.pollService.deleteChoice(id));
            editRequests = updatedChoices.map(c => this.pollService.editChoice(c.id, c.text));
        }

        const pollUpdate = this.pollService.editPoll(this.pollId, {
            question: this.pollQuestion,
            endDate: this.pollEndDate.toISOString(),
            choices: this.pollType !== 'rating' ? this.pollChoices.map(c => c.text) : [], // optional
            groupId: this.groupId
        });

        forkJoin([...deleteRequests, ...editRequests, pollUpdate]).subscribe(() => {
            this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Poll updated successfully.'
            });
            popover.hide();
            this.loadPoll();
        });
    }


    confirmDelete() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this poll?',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
        this.pollService.deletePoll(this.pollId).subscribe(() => {
            this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Poll deleted successfully.'
            });
            this.pollDeleted.emit();
        });
        }
    });
    }


}
