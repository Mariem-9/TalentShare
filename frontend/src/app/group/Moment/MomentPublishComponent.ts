import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Moment,MomentService } from '../../services/MomentService';
import { EmojiPickerComponent } from '../../components/EmojiPickerComponent';

@Component({
    selector: 'app-moment-publish',
    standalone: true,
    imports: [ FormsModule, CommonModule, DialogModule, FloatLabelModule, FileUploadModule, ButtonModule, InputTextModule,
        TextareaModule, EmojiPickerComponent],
    template: `
        <p-dialog header="Publish a Moment" [(visible)]="visible" [modal]="true" [style]="{ width: '40vw' }" (onHide)="onClose()">
            <div class="flex flex-col gap-8 pt-6 relative">
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                    <p-floatlabel style="flex-grow: 1; margin-bottom: 0;">
                    <textarea pTextarea id="momentContent" [(ngModel)]="momentText" [autoResize]="true" rows="1" cols="30" style="width: 100%;" maxlength="500"></textarea>
                    <label for="momentContent">What do you want to share?</label>
                    </p-floatlabel>
                    <button type="button" (click)="showEmojiPicker = !showEmojiPicker"
                    class="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                    style="background: transparent; border: none; padding: 0; cursor: pointer;"
                    aria-label="Toggle emoji picker" ><i class="pi pi-thumbs-up text-2xl"></i> </button>
                    <button type="button" (click)="toggleVisibility()"
                    [title]="isPublic ? 'Moment will be public' : 'Moment will be private'" class="text-blue-500 hover:text-blue-600 focus:outline-none"
                    style="background: transparent; border: none; padding: 0; cursor: pointer;">
                    <i [ngClass]="isPublic ? 'pi pi-eye' : 'pi pi-lock'" class="text-2xl"></i> </button>
                </div >
            </div>
            <hr class="my-2 border-t border-gray-300" />
            <div class="font-semibold text-xl mb-4 px-2">Add Media (optional)</div>
            <p-fileupload name="file" [customUpload]="true" [auto]="true" [multiple]="false" accept="image/*,video/*"
            maxFileSize="10000000" (uploadHandler)="onMediaUpload($event)">
                <ng-template #empty> <div>Drag and drop image or video here.</div></ng-template>
                <ng-template #content>
                    <ul *ngIf="uploadedFiles.length">
                        <li *ngFor="let file of uploadedFiles">{{ file.name }} - {{ file.size }} bytes</li>
                    </ul>
                </ng-template>
            </p-fileupload>

            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2 w-full">
                <button pButton type="button" icon="pi pi-check" class="p-button p-button-sm p-button-outlined p-button-success"
                    (click)="publishMoment()">{{ momentToEdit ? 'Save Changes' : 'Publish' }}</button>
                <button pButton type="button" icon="pi pi-times" class="p-button p-button-sm p-button-outlined p-button-danger"
                    (click)="close()">Cancel</button>
                </div>
            </ng-template>
            <div *ngIf="showEmojiPicker" class="absolute bottom-16 right-4 z-10"> <app-emoji-picker (emojiSelected)="addEmoji($event)"></app-emoji-picker></div>
        </p-dialog>


    `
})
export class MomentPublishComponent implements OnChanges {
    @Input() groupeId!: number;
    @Input() momentToEdit?: Moment;

    visible = true;
    momentText: string = '';
    uploadedFiles: File[] = [];
    selectedFile?: File;
    showEmojiPicker = false;

    public isPublic: boolean = false;



    @Output() momentPublished = new EventEmitter<void>();
    @Output() momentUpdated = new EventEmitter<Moment>();
    @Output() dialogClosed = new EventEmitter<void>();

    constructor(private momentService: MomentService) {}

    ngOnChanges(changes: SimpleChanges) {
    if (changes['momentToEdit'] && this.momentToEdit) {
        // console.log('momentToEdit object:', this.momentToEdit);
        this.momentText = this.momentToEdit.texte;
        this.isPublic = (this.momentToEdit as any).public ?? this.momentToEdit.isPublic;
        // console.log('Editing moment isPublic:', this.isPublic);
        this.uploadedFiles = [];
        this.selectedFile = undefined;
      // You may also want to handle existing media display if needed
    }
    }
    toggleVisibility() {
        this.isPublic = !this.isPublic;
    // console.log("isPublic toggled to:", this.isPublic);
    }

    onMediaUpload(event: any) {
        const file = event.files?.[0];
        if (file) {
            this.selectedFile = file;
            this.uploadedFiles = [file];
        }
    }

    publishMoment() {
        if (!this.momentText?.trim()) {
            alert('Moment text is required!');
            return;
        }

        if (this.momentToEdit) {
            // We're in edit mode
            if (this.selectedFile) {
            // Upload new media first
            this.momentService.uploadMomentFile(this.selectedFile).subscribe({
                next: (fileResponse) => {
                const mediaId = fileResponse.id;
                this._editMoment(mediaId);
                },
                error: () => alert('Media upload failed.')
            });
            } else {
            // No new media selected — send current media ID or null
            const existingMediaId = this.momentToEdit.media?.id ?? null;
            this._editMoment(existingMediaId);
            }
        } else {
            // New moment
            if (this.selectedFile) {
            this.momentService.uploadMomentFile(this.selectedFile).subscribe({
                next: (fileResponse) => this._publishWithMedia(fileResponse.id),
                error: () => alert('Media upload failed.')
            });
            } else {
            this._publishWithMedia();
            }
        }
    }

    private _publishWithMedia(mediaFileId?: number) {
        // console.log('🔼 Sending NEW moment:');
        // console.log('Texte:', this.momentText);
        // console.log('GroupeId:', this.groupeId);
        // console.log('MediaFileId:', mediaFileId);
        // console.log('isPublic:', this.isPublic);

        this.momentService.publishMoment(this.momentText, this.groupeId, mediaFileId,this.isPublic).subscribe({
            next: (response) => {
            console.log('Moment published successfully, response:', response);
            this.momentPublished.emit()
            this.close();
            ;
            },
            error: (err) => {
            console.error('Failed to publish moment:', err);
            alert('Moment publication failed. Please try again.');
            }
        });
    }
    private _editMoment(mediaId: number | null) {
        // console.log('✏️ Editing moment with:');
        // console.log('MomentId:', this.momentToEdit!.id);
        // console.log('Texte:', this.momentText);
        // console.log('MediaId:', mediaId);
        // console.log('isPublic:', this.isPublic);

        this.momentService.editMoment(this.momentToEdit!.id, this.momentText, mediaId,this.isPublic).subscribe({
            next: (updatedMoment) => {
            this.momentUpdated.emit(updatedMoment);
            this.close();
            },
            error: (err) => {
            console.error('Failed to update moment:', err);
            alert('Failed to update moment.');
            }
        });
    }

    close() {
        this.visible = false;
        this.momentText = '';
        this.selectedFile = undefined;
        this.uploadedFiles = [];
        this.dialogClosed.emit();
    }

    onClose() {
        this.close();
    }

    addEmoji(emoji: string) {
        this.momentText += emoji;
        this.showEmojiPicker = false;
    }
}
