import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
    selector: 'app-emoji-picker',
    standalone: true,
    imports: [CommonModule,PickerModule],
    template: `
        <emoji-mart
            (emojiSelect)="onEmojiSelect($event)"
            title="Pick an emoji"
            set="twitter"
            class="shadow-lg rounded-lg"
        ></emoji-mart>
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
})
export class EmojiPickerComponent {
    @Output() emojiSelected = new EventEmitter<string>();

    onEmojiSelect(event: any) {
        this.emojiSelected.emit(event.emoji?.native || event.native || '');
    }
}
