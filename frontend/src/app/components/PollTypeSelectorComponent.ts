import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-poll-type-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, RadioButtonModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Select Poll Type</h2>
            <button (click)="cancel.emit()" aria-label="Close" class="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            style="background: transparent; border: none; cursor: pointer;"> &times; </button>
        </div>
        <div class="flex flex-col gap-4">
            <div *ngFor="let t of pollTypes" class="flex items-center">
                <p-radiobutton
                [inputId]="t.id"
                name="pollType"
                [value]="t.id"
                [(ngModel)]="selectedType"
                ></p-radiobutton>
                <i [class]="t.icon + ' ml-2 mr-1'"></i>
                <label [for]="t.id" class="cursor-pointer">{{ t.label }}</label>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <button (click)="next()" [disabled]="!selectedType" class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"> Next </button>
        </div>
    </div>
</div>
    `,
})
export class PollTypeSelectorComponent {
    @Input() groupId!: number;
    @Output() cancel = new EventEmitter<void>();
    @Output() nextStep = new EventEmitter<string>();

    pollTypes = [
    { id: 'scheduling', label: 'Scheduling Poll', icon: 'pi pi-calendar' },
    { id: 'decision', label: 'Decision Poll', icon: 'pi pi-check' },
    { id: 'opinion', label: 'Opinion & Feedback Poll', icon: 'pi pi-comments' },
    { id: 'rating', label: 'Rating Poll', icon: 'pi pi-star' },
    ];

    selectedType: string | null = null;

    next() {
        if (this.selectedType) {
        this.nextStep.emit(this.selectedType);
        }
    }
}
