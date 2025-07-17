import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-confirm-dialog',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule],
  template: `
    <p-confirmDialog
      [style]="{ 'min-width': '400px', 'width': '500px', 'font-size': '1.1rem' }"
      [visible]="visible"
      [baseZIndex]="10000"
      [closable]="false"
      [dismissableMask]="true"
      [rejectVisible]="false"
      [acceptVisible]="false"
      [header]="header"
      [message]="message"
      [icon]="icon"
    >
      <ng-template pTemplate="footer">
        <div style="display: flex; justify-content: flex-start; gap: 8px;">
          <button
            pButton
            type="button"
            label="Yes"
            class="p-button-success"
            (click)="onAccept()"
            style="min-width: 100px;"
          ></button>

          <button
            pButton
            type="button"
            label="No"
            class="p-button-danger p-button-outlined"
            (click)="onReject()"
            style="min-width: 100px;"
          ></button>
        </div>
      </ng-template>
    </p-confirmDialog>
  `
})
export class CustomConfirmDialogComponent {
  @Input() visible: boolean = false;

  @Input() header: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() icon: string = 'pi pi-exclamation-triangle';

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }

  onReject() {
    this.reject.emit();
  }
}
