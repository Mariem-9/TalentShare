import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MomentService , Commentaire} from '../../services/MomentService';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { GroupeService } from '../../services/GroupeService';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmojiPickerComponent } from '../../components/EmojiPickerComponent';

@Component({
    selector: 'app-moment-comments',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule, FormsModule, FloatLabelModule,TextareaModule,AvatarModule,
        ConfirmDialogModule,EmojiPickerComponent],
    template: `
    <p-dialog header="Commentaires" [(visible)]="visible" [modal]="true" [style]="{width: '600px'}" (onHide)="onClose()">
      <div *ngIf="comments?.length; else noComments">
        <div *ngFor="let c of comments" class="comment mb-3 border-b pb-2" (click)="selectComment(c)">
            <b>{{ c.auteur.user.username }}</b> <small>{{ c.dateCommentaire | date:'short' }}</small>
            <p>{{ c.contenu }}</p>
            <div *ngIf="selectedCommentId === c.id && c.auteur.user.username === currentUsername" class="mt-1 flex gap-2">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-info" (click)="editComment(c)">Edit</button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="deleteComment(c)">Delete</button>
            </div>
        </div>
        </div>
        <ng-template #noComments>
            <p class="text-center text-gray-500">No comments for this moment.</p>
        </ng-template>
        <div class="flex flex-col gap-8 pt-6 relative">
            <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
            <p-floatlabel style="flex-grow: 1; margin-bottom: 0;">
                <textarea pTextarea id="momentContent" [(ngModel)]="newComment" [autoResize]="true" rows="1" cols="30" style="width: 100%;" maxlength="500"></textarea>
                <label for="momentContent">{{ commentBeingEdited ? 'Edit comment...' : 'Add comment...' }}</label>
            </p-floatlabel>
            <button type="button" (click)="showEmojiPicker = !showEmojiPicker" class="text-yellow-500 hover:text-yellow-600 focus:outline-none"
            style="background: transparent; border: none; padding: 0; cursor: pointer;" aria-label="Toggle emoji picker" ><i class="pi pi-thumbs-up text-2xl"></i> </button>

            </div>
        </div>
        <div *ngIf="showEmojiPicker" class="absolute bottom-16 right-4 z-10"> <app-emoji-picker (emojiSelected)="addEmoji($event)"></app-emoji-picker></div>
        <div class="mt-3 flex justify-end gap-2">
                <button pButton type="button" icon="pi pi-check" class="p-button p-button-sm p-button-outlined p-button-success"
                (click)="addCommentOrUpdate()" [disabled]="!newComment.trim()"> {{ commentBeingEdited ? 'Update' : 'Comment' }}</button>
                <button *ngIf="commentBeingEdited" pButton type="button" class="p-button p-button-sm p-button-outlined p-button-secondary"
                (click)="cancelEdit()">Cancel</button>
                <button *ngIf="!commentBeingEdited" pButton type="button" class="p-button p-button-sm p-button-outlined p-button-danger"
                (click)="onClose()"> Cancel </button>
        </div>
    </p-dialog>
    <p-confirmDialog [style]="{width: '40em'}" styleClass="custom-confirm-dialog"></p-confirmDialog>
        `,
            providers: [ConfirmationService, MessageService]
})
export class MomentCommentsComponent implements OnInit {
    @Input() momentId!: number;
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    comments: Commentaire[] = [];
    newComment = '';
    currentUsername: string | null = null;
    selectedCommentId: number | null = null;
    commentBeingEdited: Commentaire | null = null;
    showEmojiPicker = false;



    constructor(private momentService: MomentService , private groupeService: GroupeService,
        private confirmationService: ConfirmationService, private messageService: MessageService) {}

    ngOnInit() {
        this.currentUsername = sessionStorage.getItem('username');
        if(this.visible) this.loadComments();
    }

    ngOnChanges() {
        if(this.visible) this.loadComments();
    }

    loadComments() {
        this.momentService.getCommentsForMoment(this.momentId).subscribe({
            next: (data) => {
                console.log('Loaded comments:', data);
                this.comments = data;
            },
        error: (err) => console.error('Error loading comments', err)
        });
    }

    addEmoji(emoji: string) {
        this.newComment += emoji;
        this.showEmojiPicker = false;
    }

    addCommentOrUpdate() {
    if (!this.newComment.trim()) return;

    if (this.commentBeingEdited) {
        // Update existing comment
        this.momentService.updateComment(this.momentId, this.commentBeingEdited.id, this.newComment)
            .subscribe({
                next: () => {
                    this.commentBeingEdited!.contenu = this.newComment;
                    this.cancelEdit(); // Reset after edit
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Comment updated',
                        detail: 'Your comment has been updated successfully.'
                    });
                },
                error: (err) => {
                    console.error('Error updating comment', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update comment.'
                    });
                }
            });
    } else {
        // Add new comment
        this.momentService.addCommentToMoment(this.momentId, this.newComment).subscribe({
            next: (comment) => {
                this.comments.push(comment);
                this.newComment = '';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Comment added',
                    detail: 'Your comment has been posted.'
                });
            },
            error: (err) => console.error('Error adding comment', err)
        });
    }
}

    editComment(comment: Commentaire) {
        this.newComment = comment.contenu;
        this.commentBeingEdited = comment;
    }

    cancelEdit() {
        this.newComment = '';
        this.commentBeingEdited = null;
    }

    onClose() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

        selectComment(comment: Commentaire) {
    if (this.selectedCommentId === comment.id) {
        this.selectedCommentId = null;
    } else {
        this.selectedCommentId = comment.id;
    }
    }



    deleteComment(comment: Commentaire) {
    this.confirmationService.confirm({
        message: 'Do you really want to delete this comment?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Cancel',
        rejectLabel: 'Delete',
        acceptButtonStyleClass: 'p-button-danger',
        closable: false,
        dismissableMask: false,
        reject: () => {
        this.momentService.deleteComment(this.momentId, comment.id).subscribe({
            next: () => {
            this.comments = this.comments.filter(c => c.id !== comment.id);
            this.messageService.add({
                severity: 'success',
                summary: 'Commentaire supprimé',
                detail: `Le commentaire a été supprimé avec succès`
            });
            },
            error: (err) => {
            console.error('Erreur lors de la suppression du commentaire:', err);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Une erreur est survenue lors de la suppression.'
            });
            }
        });
        }
    });
    }

}
