import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../services/profileService';

@Component({
    selector: 'app-group-recommendations',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
            *ngFor="let group of recommendedGroups"
            [routerLink]="['/group', group.id]"
            class="p-4 rounded shadow bg-white hover:shadow-lg transition block"
        >
            <h2 class="font-bold text-lg">{{ group.nom }}</h2>
            <p class="text-sm text-gray-600">{{ group.description }}</p>
            <p class="text-xs text-primary mt-2">Tags: {{ group.tags?.join(', ') }}</p>
            <p class="text-xs text-gray-400">Created by: {{ group.createur.username }}</p>
        </a>
        </div>
    `
    })
    export class GroupRecommendationsComponent implements OnInit {
    recommendedGroups: any[] = [];

    constructor(private profileService: ProfileService) {}

    ngOnInit() {
        this.profileService.getGroupRecommendations().subscribe({
        next: (data) => (this.recommendedGroups = data),
        error: (err) => console.error('Error fetching recommendations', err)
        });
    }
}
