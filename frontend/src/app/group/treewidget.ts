import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { NodeService } from '../pages/service/node.service';
import { GroupeService } from '../services/GroupeService';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ActionLogService } from '../services/action-log.service';


@Component({
    selector: 'app-tree-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, TreeModule, TreeTableModule, AvatarModule, ConfirmDialogModule, ToastModule],
    template: `
    <p-tree [value]="treeValue">
        <ng-template let-node pTemplate="default">
            <div class="flex align-items-center" style="height: 28px;">
                <p-avatar *ngIf="node.data" [image]="node.data.avatarSafeUrl" [label]="!node.data.avatarSafeUrl ? node.data.initial : null" shape="circle" styleClass="bg-primary"
                [style]="{ 'width': '24px', 'height': '24px', 'font-size': '12px', 'margin-right': '0.5rem', 'display': 'flex', 'align-items': 'center','justify-content': 'center'}"> </p-avatar>
                <!-- Afficher l'image si avatarUrl existe -->
                <div class="flex items-center gap-2" style="line-height: 24px;">
                    <span class="text-sm" style="line-height: 24px;">{{ node.label }}</span>
                    <ng-container *ngIf="isCreator && node.data?.type === 'pending'">
                        <i class="pi pi-check" (click)="onAccept(node.data.id)" style="cursor:pointer; color:green; font-size:0.9rem; margin-left: 10px;" title="Accept Request"></i>
                        <i class="pi pi-times" (click)="onRefuse(node.data.id)" style="cursor:pointer; color:red; font-size:0.9rem; margin-left: 10px;" title="Reject Request"></i>
                    </ng-container>
                    <ng-container *ngIf="isCreator && node.data?.type === 'moderator'">
                        <i class="pi pi-user-minus" (click)="demoteToMember(node.data.id)" style="cursor:pointer; color:orange; font-size:0.95rem; margin-left: 10px;" title="Demote to Member"></i>
                    </ng-container>
                    <ng-container *ngIf="isCreator && node.data?.type === 'member'">
                        <i class="pi pi-shield" (click)="promoteToModerator(node.data.id)" style="cursor:pointer; color:teal; font-size:0.95rem; margin-left: 10px;" title="Promote to Moderator"></i>
                    </ng-container>
                </div>
            </div>
        </ng-template>
    </p-tree>
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    `,
    providers: [NodeService,ConfirmationService, MessageService]
})
export class Treewidget implements OnInit {
    @Input() groupId!: number;
    treeValue: TreeNode[] = [];
    isCreator = false;
    isMember = false;

    avatarUrl?: string | null

    constructor(private groupeService: GroupeService , private confirmationService: ConfirmationService,
                private messageService: MessageService , private actionLogService: ActionLogService) {}

    ngOnInit() {
        if (this.groupId) {this.loadStatus();}
    }

    loadStatus() {
        this.groupeService.isUserGroupCreator(this.groupId).subscribe({
        next: isCreator => {
            this.isCreator = isCreator;
            this.loadTree();
        }
        });

        this.groupeService.checkMembershipStatus(this.groupId).subscribe({
        next: status => {
            this.isMember = status === 'MEMBER';
        }
        });
    }
    loadTree() {
    this.groupeService.getGroupMembersByRole(this.groupId).subscribe({
        next: (data: any) => {
        const formatCount = (count: number) => {
            if (count <= 0) return '';
            if (count > 10) return '+10';
            return `(${count})`;
        };

        const extractIdFromUrl = (url: string) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 1]);
        };

        const mapUserToNode = (u: any, type: string) => ({
        ...u,
        type,
        avatarId: u.avatarUrl ? extractIdFromUrl(u.avatarUrl) : null
        });

        console.log('Data received from backend:', data);



        this.treeValue = [
            {
            label: `Creator ${formatCount(data.createur?.length || 0)}`,
            expanded: true,
            children: data.createur?.map((u: any) => this.toNode(mapUserToNode(u, 'creator'), 'creator')) ?? []

            },
            {
            label: `Moderators ${formatCount(data.moderateur?.length || 0)}`,
            expanded: true,
            children: data.moderateur?.map((u: any) => this.toNode(mapUserToNode(u, 'moderator'), 'moderator')) ?? []
            },
            {
            label: `Members ${formatCount(data.membre?.length || 0)}`,
            expanded: true,
            children: data.membre?.map((u: any) => this.toNode(mapUserToNode(u, 'member'), 'member')) ?? []
            },
            ...(this.isCreator ? [{
            label: `Pending Requests ${formatCount(data.en_attente?.length || 0)}`,
            expanded: true,
            children: data.en_attente?.map((u: any) => ({
                label: u.username,
                data: { ...mapUserToNode(u, 'pending'), type: 'pending' }
            })) ?? []
            }] : [])
        ];
        this.loadAvatarBlobs(this.treeValue);
        },
        error: err => {
        console.error('Erreur chargement membres:', err);
        }
    });
    }

    toNode(user: any, type: string = 'member'): TreeNode {
        return {
            label: user.username,
            data: {
            ...user,
            type,
            avatarId: user.avatarId,       // keep avatarId only
            avatarSafeUrl: null,           // will hold blob URL later
            initial: user.username.charAt(0).toUpperCase()
            }
        };
    }
    avatarUrls: string[] = [];
    loadAvatarBlobs(nodes: TreeNode[]) {
    nodes.forEach(node => {
        // Toujours explorer les enfants
        if (node.children?.length) {
        this.loadAvatarBlobs(node.children);
        }
        // Ne traiter l'avatar que si node.data est défini
        if (!node.data) return;

        const avatarId = node.data.avatarId;
        console.log('Checking avatar for node:', node.label, 'avatarId:', avatarId);

        if (avatarId) {
        this.groupeService.getUserAvatarBlob(avatarId).subscribe({
            next: blob => {
            const url = URL.createObjectURL(blob);
            console.log('Blob URL created:', url);
            node.data.avatarSafeUrl = url;
            this.avatarUrls.push(url);
            },
            error: err => {
            console.error('Failed to load avatar blob for', node.label, err);
            node.data.avatarSafeUrl = null;
            }
        });
        }
    });
    }

    onAccept(userId: number) {
        this.groupeService.validateJoinRequest(this.groupId, userId, true).subscribe(() => {
        this.actionLogService.log('ACCEPT_JOIN_REQUEST', `Accepted user ${userId} into group ${this.groupId}`).subscribe({
            next: () => console.log('Action logged successfully'),
            error: err => console.error('Error logging action:', err)
            });
        this.loadTree();
    });
    }

    onRefuse(userId: number) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to reject this join request?',
        header: 'Confirm Rejection',
        icon: 'pi pi-times',
        accept: () => {
        this.groupeService.validateJoinRequest(this.groupId, userId, false).subscribe({
            next: () => {
            this.actionLogService.log('ACCEPT_JOIN_REQUEST', `Accepted user ${userId} into group ${this.groupId}`).subscribe({
            next: () => console.log('Action logged successfully'),
            error: err => console.error('Error logging action:', err)
            });
            this.messageService.add({
                severity: 'info',
                summary: 'Rejected',
                detail: 'Join request has been rejected'
            });
            this.loadTree();
            },
            error: () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to reject join request'
            });
            }
        });
        }
    });
    }

    promoteToModerator(userId: number) {
        this.groupeService.promoteToModerator(this.groupId, userId).subscribe({
            next: () => {
            this.actionLogService.log('PROMOTE_TO_MODERATOR', `User ${userId} promoted in group ${this.groupId}`);
            this.loadTree();
        },
            error: err => console.error('Erreur promotion:', err)
        });
    }

    demoteToMember(userId: number) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to demote this moderator to a member?',
        header: 'Confirm Demotion',
        icon: 'pi pi-user-minus',
        accept: () => {
        this.groupeService.demoteModeratorToMember(this.groupId, userId).subscribe({
            next: () => {
                this.actionLogService.log('DEMOTE_TO_MEMBER', `User ${userId} demoted in group ${this.groupId}`);
            this.messageService.add({
                severity: 'warn',
                summary: 'Demoted',
                detail: 'User has been demoted to member'
            });
            this.loadTree();
            },
            error: () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to demote user'
            });
            }
        });
        }
    });
    }

}
