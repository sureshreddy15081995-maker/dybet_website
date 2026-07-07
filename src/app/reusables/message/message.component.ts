import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, Message } from './message.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription: Subscription = Subscription.EMPTY;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.getMessages().subscribe(messages => {
      console.log(messages)
      this.messages = messages;

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeMessage(id: number): void {
    this.messageService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  }
}