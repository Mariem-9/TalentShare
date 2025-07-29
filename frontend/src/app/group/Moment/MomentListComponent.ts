import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Moment, MomentService } from '../../services/MomentService';
import { CarouselModule } from 'primeng/carousel';
import { GroupeService } from '../../services/GroupeService';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MomentPublishComponent } from './MomentPublishComponent';
import { MomentCommentsComponent } from './MomentCommentsComponent';


@Component({
    selector: 'app-moment-carousel',
    standalone: true,
    imports: [CommonModule, CarouselModule,DialogModule ,ButtonModule, ConfirmDialogModule ,MomentPublishComponent,
        MomentCommentsComponent],
    template: `
<div class="w-[400px] mx-auto  flex flex-col items-center justify-center mb-2 border border-blue-200 rounded-md p-2">
  <p class="text-2xl font-semibold text-gray-800 mb-0">Moments</p>
  <p class="text-sm text-gray-500 mt-0">Capture. React. Remember.</p>
</div>






    <p-carousel [value]="moments" [numVisible]="1" [numScroll]="1" [circular]="false"
    [autoplayInterval]="0" [showIndicators]="true" [style.margin]="'auto'" *ngIf="moments.length > 0">
        <ng-template let-moment pTemplate="item">
            <div class="card flex flex-col gap-4 p-4 shadow-md rounded-md max-w-md mx-auto">
                <div *ngIf="mediaUrls[moment.id] && moment.media" class="mb-4 border rounded-lg ">
                    <div class="relative mx-auto h-52 bg-gray-100 rounded-lg overflow-hidden">
                        <ng-container *ngIf="mediaUrls[moment.id]">
                            <img *ngIf="moment.media.fileType?.startsWith('image/')" [src]="mediaUrls[moment.id]" [alt]="moment.texte"
                            class="w-full h-full object-cover rounded-lg cursor-pointer" (click)="openMediaModal(mediaUrls[moment.id], 'image')" />
                            <video *ngIf="moment.media.fileType?.startsWith('video/')" controls class="w-full h-full object-cover rounded-lg cursor-pointer"
                            (click)="openMediaModal(mediaUrls[moment.id], 'video')">
                            <source [src]="mediaUrls[moment.id]" [type]="moment.media.fileType" /> Votre navigateur ne supporte pas la vidéo.</video>
                        </ng-container>
                        </div>
                    </div>
                    <div class="mb-4 font-medium">{{ moment.texte }}</div>
                    <div class="flex items-center justify-between text-sm text-gray-600 mt-4">
                        <div class="flex items-center gap-3">
                            <ng-container>
                                <div class="relative">
                                    <div *ngIf="showReactionPickerForMomentId === moment.id" class="absolute bottom-full mb-2 left-1/2  -translate-x-[22%] bg-white border rounded shadow-lg p-2 z-50 flex gap-2">
                                        <button *ngFor="let emoji of allowedReactions" class="text-2xl hover:scale-110 transition-transform" (click)="submitReaction(moment, emoji)"> {{ emoji }} </button>
                                    </div>
                                    <button pButton type="button" [label]="selectedReactions[moment.id] || ''" [icon]="selectedReactions[moment.id] ? '' : 'pi pi-heart'"
                                    class="p-button p-button-sm p-button-outlined p-button-success" (click)="reactToMoment(moment)" (dblclick)="deleteReaction(moment)"></button>
                                </div>
                                <button pButton type="button"  icon="pi pi-comments" class="p-button p-button-sm p-button-outlined p-button-secondary"
                                (click)="commentOnMoment(moment)" ></button>
                                <button pButton type="button" icon="pi pi-eye" class="p-button p-button-sm p-button-outlined p-button-help" (click)="openReactionsDialog(moment)"></button>
                            </ng-container>
                            <ng-container *ngIf="isAuthor(moment)">
                                <button pButton type="button" icon="pi pi-pencil" class="p-button p-button-sm p-button-outlined p-button-info"
                                    (click)="editMoment(moment)"> </button>
                                <button pButton type="button" icon="pi pi-trash" class="p-button p-button-sm p-button-outlined p-button-danger"
                                    (click)="deleteMoment(moment)"> </button>
                            </ng-container>
                        </div>
                        <div class="text-center"> <i class="pi pi-user mr-1 text-[8px]"></i> Par {{ moment.auteur.user.username }}<br> {{ moment.datePublication | date:'short' }} </div>
                </div>
            </div>
        </ng-template>
    </p-carousel>

    <div *ngIf="moments.length === 0" class="text-center italic text-gray-500 space-y-4">
        <div>No moments yet. Why not create the first one?</div>
        <img src="assets/images/NoMoment.png" alt="NoMoment" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
    </div>

    <p-dialog [(visible)]="isMediaModalVisible" modal="true" [closable]="true" (onHide)="closeMediaModal()" [style]="{width: '80vw', maxWidth: '700px'}">
        <ng-container *ngIf="selectedMediaType === 'image'">
            <img [src]="selectedMedia" alt="Image agrandie" class="w-full h-auto rounded-lg" />
        </ng-container>
        <ng-container *ngIf="selectedMediaType === 'video'">
            <video [src]="selectedMedia" controls autoplay class="w-full h-auto rounded-lg"></video>
        </ng-container>
    </p-dialog>

    <p-dialog header="Reactions Overview" [(visible)]="showReactionsDialog" [modal]="true" [style]="{width: '400px'}" (onHide)="selectedReactionsList = []">
    <ng-container *ngIf="selectedReactionsList?.length ?? 0 > 0; else noReactions">
        <ul class="list-none p-0">
        <li *ngFor="let reaction of selectedReactionsList" class="mb-2">
            <span class="text-xl mr-2">{{ getEmojiFromReactionType(reaction.type) }}</span>
            <strong>{{ reaction.username }}</strong>
        </li>
        </ul>
    </ng-container>
    <ng-template #noReactions>
        <div class="text-center text-gray-500">No reactions for this moment yet.</div>
    </ng-template>
    </p-dialog>

    <app-moment-publish *ngIf="editingMoment" [groupeId]="groupeId" [momentToEdit]="editingMoment" (momentUpdated)="onMomentUpdated($event)"
        (dialogClosed)="editingMoment = null" ></app-moment-publish>
    <app-moment-comments [(visible)]="showCommentsDialog" [momentId]="selectedMomentId!" ></app-moment-comments>
    <p-confirmDialog [style]="{width: '40em'}" styleClass="custom-confirm-dialog"></p-confirmDialog>
    `,
        providers: [ConfirmationService, MessageService]
})
export class MomentCarouselComponent implements OnInit {
    @Input() groupeId!: number;
    moments: Moment[] = [];
    mediaUrls: { [key: number]: SafeUrl | null } = {};
    selectedMedia: SafeUrl | null = null;
    selectedMediaType: 'image' | 'video' | null = null;
    isMediaModalVisible = false;
    currentUsername: string | null = null;
    editingMoment: Moment | null = null;
    showCommentsDialog = false;
    selectedMomentId?: number;
    showReactionPickerForMomentId: number | null = null;
    selectedReactions: { [momentId: number]: string } = {};
    allowedReactions = ['👍', '❤️', '😂', '😮', '😢', '👎'];
    showReactionsDialog = false;
    selectedReactionsList: { username: string, type: string }[] = [];

    emojiToReactionType: { [key: string]: string } = {
        '👍': 'LIKE',
        '❤️': 'LOVE',
        '😂': 'WOW',
        '😮': 'WOW',
        '😢': 'SAD',
        '👎': 'ANGRY'
    };

    constructor(private momentService: MomentService, private groupeService: GroupeService
        ,private sanitizer: DomSanitizer ,  private confirmationService: ConfirmationService,
                private messageService: MessageService) {}

    ngOnInit() {
        this.currentUsername = sessionStorage.getItem('username');
        this.loadMoments();
    }
    isAuthor(moment: Moment): boolean {
        return moment.auteur.user.username === this.currentUsername;
    }

    loadMoments() {
        if (!this.groupeId) {
            console.warn('groupeId is not defined');
            return;
        }

        this.momentService.getMomentsDuGroupe(this.groupeId).subscribe({
            next: (data) => {
            this.moments = data;
            this.loadMediaBlobs();

            // Load reactions for each moment
            this.moments.forEach(moment => {
                this.momentService.getReactionsForMoment(moment.id).subscribe(reactions => {
                // Find this user's reaction only
                const userReaction = reactions.find(r => r.username === this.currentUsername);
                if (userReaction) {
                    const emoji = this.getEmojiFromReactionType(userReaction.type);
                    if (emoji) {
                    this.selectedReactions[moment.id] = emoji;
                    }
                }
                });
            });
            },
            error: (err) => console.error('Error loading moments:', err)
        });
    }

    getEmojiFromReactionType(reactionType: string): string | null {
    const match = Object.entries(this.emojiToReactionType).find(
        ([emoji, type]) => type === reactionType
    );
    return match ? match[0] : null;
    }


        loadMediaBlobs() {
        this.moments.forEach(moment => {
        if (moment.media?.id) {
            console.log('Requesting media with ID:', moment.media.id);
            this.groupeService.getUserAvatarBlob(moment.media.id).subscribe(blob => {
            const objectUrl = URL.createObjectURL(blob);
            //   console.log('Loaded media blob for moment', moment.id, objectUrl);
            this.mediaUrls[moment.id] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
            }, error => {
            console.error('Error loading media blob', error);
            this.mediaUrls[moment.id] = null;
            });
        }
        });
    }
    openMediaModal(mediaUrl: SafeUrl | null, mediaType: 'image' | 'video') {
        if (!mediaUrl) return;
            this.selectedMedia = mediaUrl;
            this.selectedMediaType = mediaType;
            this.isMediaModalVisible = true;
    }

    closeMediaModal() {
        this.isMediaModalVisible = false;
        this.selectedMedia = null;
        this.selectedMediaType = null;
    }


    editMoment(moment: Moment) {
    this.editingMoment = moment;
    }

    onMomentUpdated(updated: Moment) {
    this.loadMoments();
    this.editingMoment = null;
    }

    deleteMoment(moment: Moment) {
        this.confirmationService.confirm({
            message: 'Do you really want to delete this Moment ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Cancel',
            rejectLabel: 'Delete',
            acceptButtonStyleClass: 'p-button-danger',
            closable: false,
            dismissableMask: false,
            reject: () => {
            this.momentService.deleteMoment(moment.id).subscribe({
                next: () => {
                this.moments = this.moments.filter(m => m.id !== moment.id);
                delete this.mediaUrls[moment.id];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Moment supprimé',
                    detail: `Moment ${moment.id} a été supprimé avec succès`
                });
                },
                error: (err) => {
                console.error('Erreur lors de la suppression du moment:', err);
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

    commentOnMoment(moment: Moment) {
        this.selectedMomentId = moment.id;
        this.showCommentsDialog = true;
    }

    reactToMoment(moment: Moment) {
    const hasReacted = !!this.selectedReactions[moment.id];

    if (hasReacted) {
        this.showReactionPickerForMomentId = null;
    } else {
        this.showReactionPickerForMomentId =
        this.showReactionPickerForMomentId === moment.id ? null : moment.id;
    }
    }


    deleteReaction(moment: Moment) {
    delete this.selectedReactions[moment.id];
    this.showReactionPickerForMomentId = null;

    this.momentService.removeReaction(moment.id).subscribe({
        next: () => {
        this.messageService.add({
            severity: 'info',
            summary: 'Réaction supprimée',
            detail: 'Votre réaction a été supprimée.'
        });
        this.loadMoments();
        },
        error: (error) => {
        console.error('Erreur lors de la suppression de la réaction :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la réaction.'
        });
        }
    });
    }


    submitReaction(moment: Moment, emoji: string) {
    const reactionType = this.emojiToReactionType[emoji];

    console.log('Emoji sélectionné:', emoji);
    console.log('Type de réaction traduit:', reactionType);

    if (!reactionType) {
        console.error('Unsupported emoji reaction:', emoji);
        return;
    }

    this.selectedReactions[moment.id] = emoji;
    this.showReactionPickerForMomentId = null;

    console.log('Envoi de la réaction au backend:', {
        momentId: moment.id,
        reactionType: reactionType
    });

    this.momentService.reactToMoment(moment.id, reactionType).subscribe({
        next: (reaction) => {
        console.log('Réaction enregistrée avec succès:', reaction);
        this.messageService.add({
            severity: 'success',
            summary: 'Réaction enregistrée',
            detail: `Vous avez réagi avec ${emoji}`
        });
        this.loadMoments();
        },
        error: (error) => {
        console.error('Erreur en envoyant la réaction :', error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'enregistrer la réaction'
        });
        delete this.selectedReactions[moment.id];
        }
    });
    }

    openReactionsDialog(moment: Moment) {
    this.momentService.getReactionsForMoment(moment.id).subscribe({
        next: (reactions) => {
        this.selectedReactionsList = reactions;
        this.showReactionsDialog = true;
        },
        error: (err) => {
        console.error('Erreur lors du chargement des réactions:', err);
        this.selectedReactionsList = [];
        this.showReactionsDialog = true;
        }
    });
    }

}
