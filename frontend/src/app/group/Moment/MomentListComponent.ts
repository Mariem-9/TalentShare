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


@Component({
    selector: 'app-moment-carousel',
    standalone: true,
    imports: [CommonModule, CarouselModule,DialogModule ,ButtonModule, ConfirmDialogModule ,MomentPublishComponent],
    template: `

    <p-carousel [value]="moments" [numVisible]="1" [numScroll]="1" [circular]="false"
    [autoplayInterval]="0" [showIndicators]="true" [style.margin]="'auto'" *ngIf="moments.length > 0">
        <ng-template let-moment pTemplate="item">
            <div class="card flex flex-col gap-4 p-4 shadow-md rounded-md max-w-md mx-auto">
                <div *ngIf="mediaUrls[moment.id] && moment.media" class="mb-4 border rounded-lg ">
                    <div class="relative mx-auto h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <ng-container *ngIf="mediaUrls[moment.id]">
                        <img *ngIf="moment.media.fileType?.startsWith('image/')"
                            [src]="mediaUrls[moment.id]"
                            [alt]="moment.texte"
                            class="w-full h-full object-cover rounded-lg cursor-pointer"
                            (click)="openMediaModal(mediaUrls[moment.id], 'image')" />
                        <video *ngIf="moment.media.fileType?.startsWith('video/')" controls
                       class="w-full h-full object-cover rounded-lg cursor-pointer"
                       (click)="openMediaModal(mediaUrls[moment.id], 'video')">
                  <source [src]="mediaUrls[moment.id]" [type]="moment.media.fileType" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
                        </ng-container>
                    </div>
                </div>
                <div class="mb-4 font-medium">{{ moment.texte }}</div>
                <div class="flex items-center justify-between text-sm text-gray-600 mt-4">
                    <div> Par {{ moment.auteur.user.username }} le {{ moment.datePublication | date:'short' }} </div>
                    <div class="flex items-center gap-3">
                        <ng-container *ngIf="isAuthor(moment); else reactComment">
                        <button pButton type="button" icon="pi pi-pencil"
                            class="p-button p-button-sm p-button-outlined p-button-info"
                            (click)="editMoment(moment)">
                            Edit
                        </button>
                        <button pButton type="button" icon="pi pi-trash"
                            class="p-button p-button-sm p-button-outlined p-button-danger"
                            (click)="deleteMoment(moment)">
                            Delete
                        </button>
                        </ng-container>
                        <ng-template #reactComment>
                        <button pButton type="button" icon="pi pi-heart" class="p-button p-button-sm p-button-outlined p-button-info"
                        (click)="reactToMoment(moment)"> </button>
                        <button pButton type="button"  icon="pi pi-comments" class="p-button p-button-sm p-button-outlined p-button-secondary"
                        (click)="commentOnMoment(moment)" >Comment</button>
                        </ng-template>
                    </div>
                </div>
            </div>
        </ng-template>
    </p-carousel>


    <div *ngIf="moments.length === 0" class="text-center italic text-gray-500">
        Aucun moment à afficher.
    </div>
    <p-dialog [(visible)]="isMediaModalVisible" modal="true" [closable]="true" (onHide)="closeMediaModal()" [style]="{width: '80vw', maxWidth: '700px'}">
        <ng-container *ngIf="selectedMediaType === 'image'">
            <img [src]="selectedMedia" alt="Image agrandie" class="w-full h-auto rounded-lg" />
        </ng-container>
        <ng-container *ngIf="selectedMediaType === 'video'">
            <video [src]="selectedMedia" controls autoplay class="w-full h-auto rounded-lg"></video>
        </ng-container>
    </p-dialog>

    <app-moment-publish
  *ngIf="editingMoment"
  [groupeId]="groupeId"
  [momentToEdit]="editingMoment"
  (momentUpdated)="onMomentUpdated($event)"
  (dialogClosed)="editingMoment = null"
></app-moment-publish>


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
        console.log('Moments loaded:', data);
        this.moments = data;
        this.loadMediaBlobs();
        },
        error: (err) => console.error('Error loading moments:', err)
        });
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
        //////////
         } else {
      console.warn('No media ID for moment:', moment.id); // 👈 Helpful for debugging missing media
//////////
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

editingMoment: Moment | null = null;

editMoment(moment: Moment) {
  this.editingMoment = moment;
}

onMomentUpdated(updated: Moment) {
  this.loadMoments();
  this.editingMoment = null;
}




    deleteMoment(moment: Moment) {
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer ce moment ?',
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



reactToMoment(moment: Moment) {
  console.log('React to moment', moment);
  // Ouvre un modal ou incrémente une réaction
}

commentOnMoment(moment: Moment) {
  console.log('Comment on moment', moment);
  // Ouvre un modal ou scroll vers la section commentaires
}

}
