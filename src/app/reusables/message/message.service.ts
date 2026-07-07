import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Message {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  content: string;
  duration?: number;
  timeoutId?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  private messageSubject = new BehaviorSubject<Message[]>([]);
  private nextId = 0;

  constructor() { }

  getMessages(): Observable<Message[]> {
    return this.messageSubject.asObservable();
  }

  show(message: Omit<Message, 'id'>) {
    const newMessage: Message = {
      id: this.nextId++,
      // duration: message.duration || 5000,
      duration: message.duration || 4000,
      ...message
    };

    newMessage.timeoutId = setTimeout(() => {
      this.remove(newMessage.id);
    }, newMessage.duration);

    this.messages.push(newMessage);
    this.messageSubject.next([...this.messages]);
  }

  success(title: string, content: string, duration?: number) {
    this.show({ type: 'success', title, content, duration });
  }

  error(title: string, content: string, duration?: number) {
    this.show({ type: 'error', title, content, duration });
  }
  // error(title: string, content: string) {
  //   this.show({ type: 'error', title, content });
  // }

  warning(title: string, content: string) {
    this.show({ type: 'warning', title, content });
  }

  info(title: string, content: string) {
    this.show({ type: 'info', title, content });
  }

  remove(id: number) {
    const message = this.messages.find(m => m.id === id);
    if (message && message.timeoutId) {
      clearTimeout(message.timeoutId);
    }

    this.messages = this.messages.filter(message => message.id !== id);
    this.messageSubject.next([...this.messages]);
  }

  clear() {
    this.messages.forEach(message => {
      if (message.timeoutId) {
        clearTimeout(message.timeoutId);
      }
    });

    this.messages = [];
    this.messageSubject.next([]);
  }
}