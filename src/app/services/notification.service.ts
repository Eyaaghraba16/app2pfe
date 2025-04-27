import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  link?: string;
  targetUserId?: string; // ID de l'utilisateur cible spécifique (si null, visible par tous)
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  // Méthode publique pour accéder à la liste des notifications (pour éviter l'accès direct à notificationsSubject)
  public getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private authService: AuthService) {
    // Initialiser la connexion WebSocket
    this.socket = io('http://localhost:3000');
    
    // Écouter les notifications entrantes
    this.socket.on('notification', (notification: Notification) => {
      this.addNotification(notification);
    });
    
    // Authentifier l'utilisateur sur la connexion WebSocket
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.socket.emit('authenticate', {
          userId: user.id,
          role: user.role
        });
      }
    });
    
    // Charger les notifications depuis le stockage local
    this.loadNotificationsFromStorage();
  }

  // Ajouter une nouvelle notification
  public addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const newNotifications = [notification, ...currentNotifications];
    
    this.notificationsSubject.next(newNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }
  
  // Ajouter une notification ciblée pour un utilisateur spécifique
  public addTargetedNotification(message: string, type: 'info' | 'success' | 'warning' | 'error', targetUserId: string, link?: string): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      read: false,
      targetUserId,
      link
    };
    
    this.addNotification(notification);
  }
  
  // Générer un ID unique pour les notifications
  private generateId(): string {
    return 'notification-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => {
      return { ...notification, read: true };
    });
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Supprimer une notification
  deleteNotification(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Mettre à jour le compteur de notifications non lues
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(
      notification => !notification.read
    ).length;
    
    this.unreadCountSubject.next(unreadCount);
  }

  // Sauvegarder les notifications dans le stockage local
  private saveNotificationsToStorage(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notificationsSubject.value));
  }

  // Charger les notifications depuis le stockage local
  private loadNotificationsFromStorage(): void {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const notifications = JSON.parse(storedNotifications);
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
    }
  }

  // Déconnexion du WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
