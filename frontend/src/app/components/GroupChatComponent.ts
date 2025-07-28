import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatService } from '../services/ChatService';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ActionLogService } from '../services/action-log.service';
import { GroupeService } from '../services/GroupeService';

import { PollResponse, PollService } from '../services/poll.service';
import { PollTypeSelectorComponent } from '../group/Poll/PollTypeSelectorComponent';
import { PollPopupComponent } from '../group/Poll/PollPopupComponent ';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MomentPublishComponent } from '../group/Moment/MomentPublishComponent';



@Component({
    selector: 'app-group-chat-widget',
    standalone: true,
    imports: [CommonModule, FormsModule,PickerModule,PollTypeSelectorComponent,PollPopupComponent,TextareaModule,AvatarModule,
        ConfirmDialogModule , MomentPublishComponent ],
    template: `

<div class="flex flex-col h-full">
    <div #scrollContainer class="overflow-y-auto p-4 space-y-3" style="height: 100%; flex: 1 1 auto;">
        <div *ngFor="let msg of messages"
            [ngClass]="{
            'items-end text-right': msg.senderUsername === currentUsername,
            'items-start text-left': msg.senderUsername !== currentUsername
            }"
            class="flex flex-col w-full">
            <div class="flex items-center space-x-2 text-sm font-semibold text-gray-500 mb-1">
                <p-avatar *ngIf="msg.senderAvatarUrl; else fallbackAvatar" [image]="msg.senderAvatarUrl" shape="circle" styleClass="w-3 h-3" ></p-avatar>
                <ng-template #fallbackAvatar>
                    <p-avatar label="{{ msg.senderUsername.charAt(0).toUpperCase() }}" shape="circle" styleClass="w-3 h-3 bg-primary" ></p-avatar>
                </ng-template>
                <strong>{{ msg.senderUsername }}</strong>
            </div>
            <!-- Message -->
            <div class="inline-block px-4 py-2 rounded-xl max-w-[70%] " (click)="toggleSelected(msg)"
                [ngClass]="{
                    'bg-red-100 text-red-800': editingMessageId === findMessageId(msg),
                    'bg-blue-100 text-blue-900': editingMessageId !== findMessageId(msg) && msg.senderUsername === currentUsername,
                    'bg-gray-200 text-gray-800': editingMessageId !== findMessageId(msg) && msg.senderUsername !== currentUsername
                }">
                <div *ngIf="editingMessageId === findMessageId(msg); else viewMode">
                    {{ msg.content }}
                    <div class="text-xs text-gray-500 mt-1">{{ msg.timestamp | date:'MMM d, h:mm a' }}</div>
                </div>

                <ng-template #viewMode>
                <div class="relative group"  *ngIf="editingMessageId !== msg.id">
                    {{ msg.content }}
                    <div class="text-xs text-gray-500 mt-1"> {{ msg.timestamp | date:'MMM d, h:mm a' }} </div>
                    <div *ngIf="selectedMessageId === msg.id" class="absolute right-0 mt-6 w-28 bg-white border border-gray-200 rounded-xl shadow-xl z-10 text-sm font-medium overflow-hidden">
                        <button (click)="startEditing(msg)" class="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors duration-150">
                            <i class="pi pi-pencil text-xs"></i> Edit
                        </button>
                        <div class="border-t border-gray-200"></div>
                        <button (click)="deleteMessage(msg)" class="flex items-center gap-2 w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-colors duration-150">
                            <i class="pi pi-trash text-xs"></i> Delete
                        </button>
                    </div>
                </div>
                </ng-template>
            </div>
        </div>
    </div>

    <!-- Formulaire -->
    <form (ngSubmit)="onSendMessage($event)" class="mt-4 relative px-4 py-3">

        <div *ngIf="editingMessageId" class="text-sm text-gray-600 mb-1 flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
            <span>You’re editing a red-highlighted message</span>
            <button (click)="cancelEditing()" type="button" class="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Cancel editing">
            <i class="pi pi-times text-sm"></i>
            </button>
        </div>
        <div class="relative w-full">
            <textarea pTextarea [(ngModel)]="newMessage" name="message" placeholder="Type your message..."
            class="w-full p-2 pr-12  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            rows="1" [autoResize]="true" maxlength="115" (input)="onInput($event)"></textarea>

            <div class="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-3 ">

                <button *ngIf="canCreatePoll" type="button" (click)="onCreatePoll()" class="text-purple-600 hover:text-purple-800 focus:outline-none"
                style="background: transparent; border: none; padding: 0; cursor: pointer;" aria-label="Créer un sondage">
                <i class="pi pi-chart-bar text-2xl"></i>
                </button>

                <button type="button" (click)="toggleMomentPublish()" class="text-gray-500 hover:text-gray-600 focus:outline-none" style="background: transparent; border: none; padding: 0; cursor: pointer;"
                aria-label="Publier un moment" > <i class="pi pi-paperclip text-2xl"></i></button>

                <button
                type="button"
                (click)="toggleEmojiPicker()"
                class="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                style="background: transparent; border: none; padding: 0; cursor: pointer;"
                aria-label="Toggle emoji picker"
                >
                <i class="pi pi-thumbs-up text-2xl"></i>
                </button>
                <button
                type="submit"
                [disabled]="!websocketReady"
                class="text-blue-600 hover:text-blue-800 focus:outline-none"
                style="background: transparent; border: none; padding: 0; cursor: pointer;"
                aria-label="Send message"
                >
                <i class="pi pi-send text-2xl"></i>
                </button>
            </div>
            <div *ngIf="showEmojiPicker" class="absolute bottom-16 right-4 z-10">
                <emoji-mart
                    *ngIf="showEmojiPicker"
                    (emojiSelect)="addEmoji($event)"
                    title="Pick an emoji"
                    set="twitter"
                    class="shadow-lg rounded-lg"
                ></emoji-mart>
            </div>
            </div>
    </form>

    <app-poll-type-selector
    *ngIf="showPollTypeSelector"
    (cancel)="onPollTypeCancel()"
    (nextStep)="onPollTypeNext($event)"
    ></app-poll-type-selector>
    <app-poll-popup *ngIf="selectedPollType" [pollType]="selectedPollType" [groupId]="groupId" (cancel)="onPollPopupCancel()"(created)="onPollCreated($event)"></app-poll-popup>
    <app-moment-publish *ngIf="showMomentPublish" [groupeId]="groupId" (momentPublished)="onMomentPublished()"
  (dialogClosed)="toggleMomentPublish()"></app-moment-publish>

</div>
<p-confirmDialog [style]="{width: '40em'}"></p-confirmDialog>

`,
encapsulation: ViewEncapsulation.None,
styles: [`
    /* Main container */
    emoji-mart {
        --bg-color: #f9fafb;
        --text-color: #333;
        --hover-color: #e0e7ff;
        --border-color: #e5e7eb;
    }

    /* Override all emoji-mart elements */
    emoji-mart .emoji-mart {
        width: 280px !important;
        background-color: var(--bg-color) !important;
        border-radius: 10px !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
        font-size: 14px !important;
        border: 1px solid var(--border-color) !important;
    }

    /* Category labels (Frequently Used, Smileys & People, etc.) */
    emoji-mart .emoji-mart-category-label {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
    }

    /* Individual emoji hover state */
    emoji-mart .emoji-mart-emoji:hover::before {
        background-color: var(--hover-color) !important;
    }

    /* Scroll area */
    emoji-mart .emoji-mart-scroll {
        background-color: var(--bg-color) !important;
    }

    /* All category sections */
    emoji-mart .emoji-mart-category {
        background-color: var(--bg-color) !important;
    }

    /* Emoji preview area */
    emoji-mart .emoji-mart-preview {
        background-color: var(--bg-color) !important;
        border-top: 1px solid var(--border-color) !important;
    }

    /* Search bar */
    emoji-mart .emoji-mart-search input {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
        border: 1px solid var(--border-color) !important;
    }

    /* Fallback - remove any remaining dark backgrounds */
    emoji-mart * {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
    }
`],
    providers: [ConfirmationService, MessageService]
})
export class GroupChatComponent implements OnInit {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    @Input() groupId!: number;
    messages: ChatMessage[] = [];
    newMessage: string = '';
    websocketReady = false;
    currentUsername = sessionStorage.getItem('username') || '';
    showEmojiPicker = false;

    canCreatePoll: boolean = false;
    showPollTypeSelector = false;
    selectedPollType: string | null = null;

    editingMessageId: number | null = null;
    editingMessageContent: string = '';
    selectedMessageId: number | null = null;
    @Output() pollCreated = new EventEmitter<{ poll: PollResponse; type: string }>();


    constructor(private chatService: ChatService, private actionLogService: ActionLogService ,
                private groupeService: GroupeService , private pollService: PollService ,private confirmationService: ConfirmationService,
        private messageService: MessageService ,) {}

    ngOnInit() {
        if (!this.groupId) return;

        this.chatService.getMessageHistory(this.groupId).subscribe(messages => {
            console.log('Initial message history:', messages);
            this.messages = messages;

            this.loadAvatarsForMessages(this.messages);

            setTimeout(() => this.scrollToBottom(), 0);
        });

        this.chatService.connect(this.groupId, (msg) => {
            this.messages.push(msg);

            this.loadAvatarsForMessages([msg]);

            setTimeout(() => this.scrollToBottom(), 0);
        }, () => {
            this.websocketReady = true;
        });

        this.checkUserRole();
        }

    loadAvatarsForMessages(messages: ChatMessage[]) {
        messages.forEach(msg => {
            if (msg.senderAvatarUrl) {
            const id = this.extractIdFromUrl(msg.senderAvatarUrl);
            if (!isNaN(id)) {
                this.groupeService.getUserAvatarBlob(id).subscribe({
                next: blob => {
                    const url = URL.createObjectURL(blob);
                    msg.senderAvatarUrl = url;
                },
                error: err => {
                    console.error('Failed to load avatar for message sender', err);
                    msg.senderAvatarUrl = null;
                }
                });
            }
            } else {
            msg.senderAvatarUrl = null;
            }
        });
        }

    extractIdFromUrl(url: string): number {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 1]);
        }


    scrollToBottom() {
        try {
            // console.log('Scrolling to bottom...');
            const container = this.scrollContainer.nativeElement;
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } catch (err) {
            console.error('Failed to scroll', err);
        }
    }

    checkUserRole() {
        this.groupeService.getGroupMembersByRole(this.groupId).subscribe({
            next: rolesMap => {
            const moderators = rolesMap.moderateur?.map((u: any) => u.username) || [];
            const creators = rolesMap.createur?.map((u: any) => u.username) || [];

            this.canCreatePoll = [...moderators, ...creators].includes(this.currentUsername);
            // console.log('Current user:', this.currentUsername);
            // console.log('Moderators:', moderators);
            // console.log('Creators:', creators);
            // console.log('canCreatePoll:', this.canCreatePoll);
            },
            error: err => {
            console.error('Failed to fetch group roles', err);
            this.canCreatePoll = false;
            }
        });
    }


    // onSendMessage(event?: Event) {
    // if (event) event.preventDefault(); // Prevent default form submission

    // console.log("Send button clicked");
    // console.log("WebSocket ready:", this.websocketReady);
    // console.log("Message:", this.newMessage);



    // if (this.newMessage.trim() && this.websocketReady) {
    //     this.chatService.sendMessage(this.groupId, this.newMessage.trim());
    //     this.actionLogService
    //     .log('SEND_CHAT_MESSAGE', `Sent message to group ${this.groupId}`)
    //     .subscribe({
    //         next: () => console.log('Action logged successfully'),
    //         error: err => console.error('Error logging action:', err)
    // });

    //     this.newMessage = '';
    // }
    // }
    onSendMessage(event?: Event) {
    if (event) event.preventDefault();

    if (!this.websocketReady || !this.newMessage.trim()) return;

    if (this.editingMessageId !== null) {
        this.saveEdit();
    } else {
        this.chatService.sendMessage(this.groupId, this.newMessage.trim());
        this.actionLogService
        .log('SEND_CHAT_MESSAGE', `Sent message to group ${this.groupId}`)
        .subscribe({
            next: () => console.log('Action logged successfully'),
            error: err => console.error('Error logging action:', err)
        });
        this.newMessage = '';
    }
    }
    toggleSelected(msg: ChatMessage): void {
        if (msg.senderUsername !== this.currentUsername) return;

        this.selectedMessageId = (this.selectedMessageId === msg.id) ? null : msg.id;
    }

    startEditing(msg: ChatMessage) {
        this.editingMessageId = msg.id;
        this.newMessage = msg.content;
    }

    cancelEditing() {
        this.editingMessageId = null;
        this.newMessage = '';
    }
    findMessageId(msg: ChatMessage): number | null { return (msg as any).id || null;}
    saveEdit() {
        if (this.editingMessageId === null || !this.newMessage.trim()) return;

        this.chatService.editMessage(this.editingMessageId, this.newMessage.trim())
            .subscribe({
            next: (updatedMsg) => {
                const index = this.messages.findIndex(m => this.findMessageId(m) === this.editingMessageId);
                if (index !== -1) {
                this.messages[index].content = updatedMsg.content;
                this.messages[index].timestamp = updatedMsg.timestamp;
                }
                this.chatService.getMessageHistory(this.groupId).subscribe(messages => {
                    this.messages = messages;
                    this.loadAvatarsForMessages(this.messages);
                    this.scrollToBottom();
                });
                this.editingMessageId = null;
                this.newMessage = '';
            },
            error: (err) => console.error('Failed to edit message', err)
            });
    }
    deleteMessage(msg: ChatMessage) {
    const messageId = this.findMessageId(msg);
    if (messageId === null) return;

    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this message?',
        header: 'Confirm Deletion',
        icon: 'pi pi-trash',
        rejectLabel: 'Delete',
        acceptLabel: 'Cancel',
        acceptButtonStyleClass: 'p-button-danger',
        closable: false,
        dismissableMask: false,
        reject: () => {
        this.chatService.deleteMessage(messageId)
            .subscribe({
            next: () => {
                this.messages = this.messages.filter(m => this.findMessageId(m) !== messageId);
                this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Message deleted' });
                this.actionLogService.log('DELETE_MESSAGE_SUCCESS', `Message ID ${messageId} deleted`).subscribe();
            },
            error: (err) => {
                console.error('Failed to delete message', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete message' });
            }
            });
        }
    });
    }

    toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    console.log('showEmojiPicker:', this.showEmojiPicker);
    }

    addEmoji(event: any) {
    this.newMessage = (this.newMessage || '') + event.emoji.native;
    this.showEmojiPicker = false;
    }

    onCreatePoll() {
    this.showPollTypeSelector = true;
    this.selectedPollType = null;
    }

    onPollTypeCancel() {
    this.showPollTypeSelector = false;
    this.selectedPollType = null;
    }

    onPollTypeNext(type: string) {
    this.selectedPollType = type;
    this.showPollTypeSelector = false;
    }

    onPollPopupCancel() {
    this.selectedPollType = null;
    this.showPollTypeSelector = true;
    }

    onPollCreated(poll: PollResponse) {
    this.pollCreated.emit({ poll, type: this.selectedPollType! });
    this.selectedPollType = null;
    }

    onInput(event: Event) {
        const input = event.target as HTMLTextAreaElement;
        if (input.value.length > 115) {
            input.value = input.value.slice(0, 115);
            this.newMessage = input.value;
        }
    }

    showMomentPublish = false;
    onMomentPublished() {
  // Logic to refresh moments, show a success message, etc.
  console.log('Moment published!');
  this.toggleMomentPublish(); // Optionally hide the dialog after publishing
}


toggleMomentPublish() {
  this.showMomentPublish = !this.showMomentPublish;
}

}
