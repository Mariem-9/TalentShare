import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatService } from '../services/ChatService';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ActionLogService } from '../services/action-log.service';



@Component({
    selector: 'app-group-chat-widget',
    standalone: true,
    imports: [CommonModule, FormsModule,PickerModule],
    template: `
<div class="flex flex-col h-full min-h-0">
    <div class="flex-grow min-h-0 overflow-y-auto p-4 space-y-3">
        <div *ngFor="let msg of messages"
            [ngClass]="{
            'items-end text-right': msg.senderUsername === currentUsername,
            'items-start text-left': msg.senderUsername !== currentUsername
            }"
            class="flex flex-col w-full">

        <!-- Nom toujours aligné à gauche -->
        <div class="text-sm font-semibold text-gray-500 mb-1 text-left">
            <strong>{{ msg.senderUsername }}</strong>
        </div>

        <!-- Message -->
        <div class="inline-block px-4 py-2 rounded-xl max-w-[70%]"
            [ngClass]="{
                'bg-blue-100 text-blue-900': msg.senderUsername === currentUsername,
                'bg-gray-200 text-gray-800': msg.senderUsername !== currentUsername
            }">
            {{ msg.content }}
            <div class="text-xs text-gray-500 mt-1">
            {{ msg.timestamp | date:'MMM d, h:mm a' }}
            </div>
        </div>

        </div>
    </div>

    <!-- Formulaire -->
    <form (ngSubmit)="onSendMessage($event)" class="mt-4 relative px-4 py-3">
        <input
        type="text"
        [(ngModel)]="newMessage"
        name="message"
        placeholder="Type your message..."
        class="w-full p-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div class="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">

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
    </form>
</div>
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
`]
})
export class GroupChatComponent implements OnInit {
  @Input() groupId!: number; // get groupId from parent
    messages: ChatMessage[] = [];
    newMessage: string = '';
    websocketReady = false;
    currentUsername = sessionStorage.getItem('username') || '';
    showEmojiPicker = false;

    constructor(private chatService: ChatService, private actionLogService: ActionLogService) {}

    ngOnInit() {
    if (!this.groupId) return;
    this.chatService.getMessageHistory(this.groupId).subscribe(messages => {
        this.messages = messages;
    });

    this.chatService.connect(this.groupId, (msg) => {
        this.messages.push(msg);
    }, () => {
        this.websocketReady = true;
    });
    }

    onSendMessage(event?: Event) {
    if (event) event.preventDefault(); // Prevent default form submission

    console.log("Send button clicked");
    console.log("WebSocket ready:", this.websocketReady);
    console.log("Message:", this.newMessage);

    if (this.newMessage.trim() && this.websocketReady) {
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

    toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    console.log('showEmojiPicker:', this.showEmojiPicker);
    }

    addEmoji(event: any) {
    this.newMessage = (this.newMessage || '') + event.emoji.native;
    this.showEmojiPicker = false;
    }


}
