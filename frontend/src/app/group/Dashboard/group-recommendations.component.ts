import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ProfileService } from '../../services/profileService';
import { DialogModule } from 'primeng/dialog';
import { GroupDetailsWidget } from '../GroupInfo/group-details-widget';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-group-recommendations',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule,TagModule,DialogModule,GroupDetailsWidget,CarouselModule,CardModule],
    template: `
        <div class="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-200 text-white rounded-lg p-4 mb-6 font-extrabold text-2xl text-center drop-shadow-md">
            Discover Your Next Favorite Group
        </div>
        <img src="assets/images/group_recommend.png" alt="group_recommend" class=" object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
        <div class="h-4"></div>


        <p-carousel *ngIf="recommendedGroups.length"
            [value]="recommendedGroups"
            [numVisible]="2"
            [numScroll]="2"
            [circular]="true"
            [autoplayInterval]="4000">

            <ng-template let-group pTemplate="item">
                <p-card styleClass="m-2 w-[28rem] h-80 overflow-hidden cursor-pointer" (click)="openGroupDialog(group)">
                <div class="w-[24rem] h-64 border border-gray-300 rounded-lg p-6 bg-white flex flex-col justify-center">

                    <div class="w-full">
                    <h2 class="font-bold text-xl mb-2">{{ group.nom }}</h2>
                    <p class="text-base text-gray-800 mb-4">{{ group.description }}</p>
                    </div>

                    <div class="mt-auto flex flex-wrap gap-2">
                    <p-tag *ngFor="let tag of group.tags"
                            [value]="tag"
                            [severity]="getSeverityForTag(tag)"
                            class="text-sm">
                    </p-tag>
                    </div>

                </div>
                </p-card>
            </ng-template>
        </p-carousel>
        <!-- <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">

            <a *ngFor="let group of recommendedGroups" (click)="openGroupDialog(group)" class="p-12 rounded shadow bg-white hover:shadow-lg transition block ">
            <h2 class="font-bold text-2xl">{{ group.nom }}</h2>
                <p class="text-lg text-gray-800">{{ group.description }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                    <p-tag *ngFor="let tag of group.tags" [value]="tag" [severity]="getSeverityForTag(tag)" class="text-sm"> </p-tag>
                </div>
            </a>
        </div> -->


        <p-dialog [(visible)]="displayDialogDetails" [style]="{width: '70em'}"> <app-group-details-widget [group]="groupallowed"
        [groupId]="groupallowed?.id" (membershipChanged)="onMembershipChanged()"></app-group-details-widget></p-dialog>

    `
    })
    export class GroupRecommendationsComponent implements OnInit {
    recommendedGroups: any[] = [];
    tagSeverities: Map<string, string> = new Map();
    displayDialogDetails: boolean = false;
    groupallowed: any = null;

    constructor(private profileService: ProfileService) {}

    ngOnInit() {
        this.profileService.getGroupRecommendations().subscribe({
        next: (data) => {
        this.recommendedGroups = data;
        this.assignSeverities();
        },
        error: (err) => console.error('Error fetching recommendations', err)
        });
    }

    onMembershipChanged() {
    this.profileService.getGroupRecommendations().subscribe({
            next: (data) => {
                this.recommendedGroups = data;
                this.assignSeverities();
            },
            error: (err) => console.error('Error refreshing recommendations', err)
        });
    window.dispatchEvent(new CustomEvent('membershipChangedExternally'));
    }

    openGroupDialog(group: any) {
        this.groupallowed = group;
        this.displayDialogDetails = true;
    }

    assignSeverities() {
        this.tagSeverities.clear();
        this.recommendedGroups.forEach(group => {
        if (group.tags) {
            group.tags.forEach((tag: string) => {
            if (!this.tagSeverities.has(tag)) {
                this.tagSeverities.set(tag, this.getRandomSeverity());
            }
            });
        }
        });
    }

    getSeverityForTag(tag: string): string {
        return this.tagSeverities.get(tag) || 'info';
    }

    getRandomSeverity(): string {
        const severities = ['success', 'info', 'warning', 'danger', 'help'];
        const index = Math.floor(Math.random() * severities.length);
        return severities[index];
    }
}
