
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService, PollRequest, PollResponse } from '../services/poll.service';
import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-poll-popup',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RatingModule,
        CalendarModule,
        FloatLabelModule,
        InputTextModule,
        ButtonModule,ToastModule
    ],
    template: `
        <p-toast></p-toast>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <h2 class="text-xl font-bold mb-6">Create {{ pollType | titlecase }} Poll</h2>
                <p-floatLabel class="mb-6">
                    <input pInputText id="question" type="text" [(ngModel)]="question" class="w-full"/>
                    <label for="question">Poll Question</label>
                </p-floatLabel>
                <p-floatLabel class="mb-6 w-full">
                    <p-calendar id="endDate" [(ngModel)]="endDate" [showIcon]="true" [showButtonBar]="true"
                        [showTime]="true" hourFormat="24" dateFormat="dd/mm/yy" inputStyleClass="w-full" styleClass="w-full" ></p-calendar>
                    <label for="endDate">Closing Date</label>
                </p-floatLabel>
                <div *ngIf="pollType === 'scheduling'">
                    <div *ngFor="let opt of options; let i = index" class="mb-6">
                        <p-floatLabel class="w-full">
                            <p-calendar [attr.id]="'option' + i" [(ngModel)]="options[i]" [showIcon]="true" [showButtonBar]="true" [showTime]="true" hourFormat="24"
                            dateFormat="dd/mm/yy" inputStyleClass="w-full" styleClass="w-full"> </p-calendar>
                            <label [attr.for]="'option' + i">Option {{ i + 1 }}</label>
                        </p-floatLabel>
                    </div>
                </div>
                <div *ngIf="pollType === 'decision'" class="mb-6">
                    <div class="flex flex-col gap-6">
                        <p-floatLabel>
                            <input pInputText id="option1" type="text" value="Yes" readonly class="w-full bg-gray-100"/>
                            <label for="option1">Option 1</label>
                        </p-floatLabel>
                        <p-floatLabel>
                            <input pInputText id="option2" type="text" value="I don't know" readonly class="w-full bg-gray-100" />
                            <label for="option2">Option 2</label>
                        </p-floatLabel>
                        <p-floatLabel>
                            <input pInputText id="option3" type="text" value="No" readonly class="w-full bg-gray-100" />
                            <label for="option3">Option 3</label>
                        </p-floatLabel>
                    </div>
                </div>
                <div *ngIf="pollType === 'rating'" class="mb-6">
                    <p-floatLabel>
                        <input pInputText id="ratingDisplay" type="text" [value]="'★★★★★'" readonly class="w-full bg-gray-100" />
                        <label for="ratingDisplay">Rating : 5-star scale</label>
                    </p-floatLabel>
                </div>
                <div *ngIf="pollType !== 'rating' && pollType !== 'decision' && pollType !== 'scheduling'">
                    <div *ngFor="let opt of options; let i = index" class="flex items-center mb-6 gap-2">
                        <p-floatLabel class="flex-grow">
                            <input pInputText id="option{{i}}" type="text" [(ngModel)]="options[i]" class="w-full" />
                            <label for="option{{i}}">Option {{i + 1}}</label>
                        </p-floatLabel>
                        <button *ngIf="options.length > 2" pButton type="button" icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger"
                            (click)="removeOption(i)" title="Remove option" ></button>
                    </div>
                    <button pButton type="button" icon="pi pi-plus" label="Add another option" class="p-button-text p-button-sm mb-3" (click)="addOption()" ></button>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button pButton type="button" label="Back" icon="pi pi-arrow-left" class="p-button-secondary" (click)="onCancel()" ></button>
                    <button pButton type="button" label="Créer" icon="pi pi-check" class="p-button-success" (click)="onCreate()"></button>
                </div>
            </div>
        </div>

    `,
    styles: [`
        .p-calendar { width: 100%; }
        .p-calendar .p-inputtext { width: 100%; }
        .p-float-label { display: block; width: 100%; }

    `],providers: [MessageService]
})
export class PollPopupComponent implements OnInit {
    @Input() pollType!: string;
    @Input() groupId!: number;

    @Output() cancel = new EventEmitter<void>();
    @Output() created = new EventEmitter<PollResponse>();

    question = '';
    endDate!: Date;
    options: any[] = [];
    ratingValue = 0;

    showValidationDialog = false;
    validationMessage = '';


    constructor(private pollService: PollService , private messageService: MessageService) {}

    ngOnInit(): void {
        // Set default end date to 24 hours from now
        const now = new Date();
        this.endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        if (this.pollType === 'decision') {
        // Decision polls have fixed options handled in template
        } else {
        // Other poll types start with two empty options
        this.options = ['', ''];
        }
    }

    addOption(): void {
        this.options.push('');
    }

    removeOption(index: number): void {
        if (this.options.length > 2) {
        this.options.splice(index, 1);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }
    onCreate(): void {
    if (!this.question.trim()) {
        this.messageService.add({ severity: 'warn', summary: 'Missing Question', detail: 'Please enter a question.' });
        return;
    }

    let choices: string[] = [];

    switch (this.pollType) {
        case 'rating':
        choices = ['1', '2', '3', '4', '5'];
        break;
        case 'decision':
        choices = ['Yes', 'No', "I don't know"];
        break;
        case 'scheduling':
        const validDates = this.options.filter(opt => opt instanceof Date);
        if (validDates.length < 2) {
            this.messageService.add({ severity: 'warn', summary: 'Insufficient Options', detail: 'Please provide at least two valid date options.' });
            return;
        }
        choices = validDates.map(date => date.toISOString());
        break;
        default:
        const validOptions = this.options.filter(opt => opt && opt.trim().length > 0);
        if (validOptions.length < 2) {
            this.messageService.add({ severity: 'warn', summary: 'Too Few Options', detail: 'Please provide at least two options.' });
            return;
        }
        choices = validOptions;
    }

    const pollData: PollRequest = {
        question: this.question,
        endDate: this.endDate.toISOString(),
        choices,
        groupId: this.groupId,
    };

    this.pollService.createPoll(pollData).subscribe({
        next: (poll) => {
        this.created.emit(poll);
        },
        error: (err) => {
        console.error('Error creating poll', err);
        this.messageService.add({ severity: 'error', summary: 'Creation Failed', detail: 'Failed to create poll. Please try again.' });
        },
    });
}
}
