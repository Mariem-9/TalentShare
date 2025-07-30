
import { Component, OnInit } from '@angular/core';
import { MomentService } from '../../services/MomentService';
import { Moment } from '../../services/MomentService';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GroupeService } from '../../services/GroupeService';
import { DialogModule } from 'primeng/dialog';


@Component({
    selector: 'app-public-moments',
    standalone: true,
    imports: [CommonModule, CarouselModule, CardModule, ButtonModule,DialogModule],
    template: `
        <div class="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-200 text-white rounded-lg p-4 mb-6 font-extrabold text-2xl text-center drop-shadow-md">
            From Us, For You – Shared Public Moments
        </div>
        <img src="assets/images/moments.png" alt="moments" class=" object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
        <div class="h-4"></div>
        <p-carousel *ngIf="publicMoments.length" [value]="publicMoments" [numVisible]="2" [numScroll]="2" [circular]="true" [autoplayInterval]="4000">
            <ng-template let-moment pTemplate="item">
                <p-card styleClass="m-2 w-[28rem] h-80 overflow-hidden ">
                    <div class="w-[24rem] h-64 border border-gray-300 rounded-lg p-6 bg-white flex flex-col justify-center items-center ">
                        <div *ngIf="moment.media && mediaUrls[moment.id]" class="relative mx-auto h-40 bg-gray-100 rounded-lg overflow-hidden">
                            <ng-container>
                            <img *ngIf="moment.media.fileType?.startsWith('image/')" [src]="mediaUrls[moment.id]" [alt]="moment.texte"
                                class="w-full h-full object-cover rounded-lg cursor-pointer" (click)="openMediaModal(mediaUrls[moment.id], 'image')" />
                            <video *ngIf="moment.media.fileType?.startsWith('video/')" controls class="w-full h-full object-cover rounded-lg cursor-pointer"
                                (click)="openMediaModal(mediaUrls[moment.id], 'video')">
                                <source [src]="mediaUrls[moment.id]" [type]="moment.media.fileType" /> Votre navigateur ne supporte pas la vidéo.
                            </video>
                            </ng-container>
                        </div>
                        <div class="w-full">
                            <ng-container >
                                <div class="text-base text-gray-800 leading-relaxed mb-1">
                                <span class="font-semibold">{{ getTruncatedText(moment) }}</span>
                                <button *ngIf="shouldShowReadMore(moment)" (click)="openReadMoreModal(moment)" class="text-blue-600 text-sm mt-1 underline hover:text-blue-800">
                                Read more </button>
                                <div class="text-sm text-gray-600 mt-1 italic">
                                    — {{ moment.auteur.user.username }}, {{ moment.groupe?.nom || 'Not specified' }} · {{ moment.datePublication | date:'longDate' }}
                                </div>
                                </div>
                            </ng-container>
                        </div>
                    </div>
                </p-card>
            </ng-template>
        </p-carousel>
        <p *ngIf="!publicMoments.length" class="text-center text-gray-500 mt-4">
        Oops! Looks like no public moments have been shared yet.
        </p>


    <p-dialog [(visible)]="isMediaModalVisible" modal="true" [closable]="true" (onHide)="closeMediaModal()" [style]="{width: '80vw', maxWidth: '700px'}">
        <div *ngIf="selectedText?.trim()" class="mb-4 text-gray-800 text-base whitespace-pre-line border border-gray-300 rounded-md p-3 bg-gray-50">
            {{ selectedText }}
        </div>
        <ng-container *ngIf="selectedMediaType === 'image'">
            <img [src]="selectedMedia" alt="Image agrandie" class="w-full h-auto rounded-lg" />
        </ng-container>
        <ng-container *ngIf="selectedMediaType === 'video'">
            <video [src]="selectedMedia" controls autoplay class="w-full h-auto rounded-lg"></video>
        </ng-container>
    </p-dialog>
  `,
})
export class PublicMomentsComponent implements OnInit {
    publicMoments: Moment[] = [];
    selectedMediaType: 'image' | 'video' | null = null;

    mediaUrls: { [key: number]: SafeUrl | null } = {};
    selectedMedia: SafeUrl | null = null;
    isMediaModalVisible: boolean = false;

    selectedText: string = '';
    selectedMoment: Moment | null = null;


    constructor(private momentService: MomentService, private sanitizer: DomSanitizer, private groupeService: GroupeService) {}


    ngOnInit(): void {
        this.loadPublicMoments();
    }

    loadPublicMoments(): void {
        this.momentService.getMomentsPublics().subscribe({
        next: (data) => {
            console.log('Fetched moments:', data);
            this.publicMoments = data;
            this.mediaUrls = {};
        for (const moment of data) {
            if (moment.media?.id) {
            // Appelle ta méthode getUserAvatarBlob pour récupérer le blob
            this.groupeService.getUserAvatarBlob(moment.media.id).subscribe({
                next: (blob) => {
                const objectUrl = URL.createObjectURL(blob);
                this.mediaUrls[moment.id] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
                },
                error: (err) => {
                console.error('Erreur lors du chargement du média blob', err);
                this.mediaUrls[moment.id] = null;
                }
            });
            }
        }
        },
        error: (err) => {
        console.error('Erreur lors de la récupération des moments publics', err);
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

    shouldShowReadMore(moment: Moment): boolean {
    const hasMedia = moment.media != null;
    const maxLength = hasMedia ? 138 :236;
    return moment.texte.length > maxLength;
    }
    getTruncatedText(moment: Moment): string {
    const hasMedia = moment.media != null;
    const maxLength = hasMedia ? 138 : 236;

    if (moment.texte.length <= maxLength) {
        return moment.texte;
    }

    return moment.texte.substring(0, maxLength) + '...';
    }


    openReadMoreModal(moment: Moment) {
    this.selectedText = moment.texte;
    this.selectedMoment = moment;

    const mediaUrl = this.mediaUrls[moment.id] || null;

    if (moment.media && mediaUrl) {
        this.selectedMedia = mediaUrl;
        this.selectedMediaType = moment.media.fileType.startsWith('image/')
        ? 'image'
        : 'video';
    } else {
        this.selectedMedia = null;
        this.selectedMediaType = null;
    }

    this.isMediaModalVisible = true;
    }

}
