import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;

  currentUserId: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // S'abonner aux notifications
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.filterNotifications();
      console.log('Notifications filtrées:', this.filteredNotifications);
    });

    // S'abonner au compteur de notifications non lues
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    
    // Afficher les informations de l'utilisateur actuel pour le débogage
    console.log('Utilisateur actuel:', this.authService.currentUserValue);
    console.log('Est admin:', this.authService.isAdmin());
    console.log('Est chef:', this.authService.isChef());
  }
  
  // Filtrer les notifications en fonction des identifiants cibles et du contenu des messages
  private filterNotifications(): void {
    const isAdmin = this.authService.isAdmin();
    const isChef = this.authService.isChef();
    const currentUser = this.authService.currentUserValue;
    const userId = currentUser?.id || '';
    
    console.log('Filtrage des notifications:');
    console.log('- isAdmin:', isAdmin);
    console.log('- isChef:', isChef);
    console.log('- userId:', userId);
    console.log('- Toutes les notifications:', this.notifications);
    
    // Filtrer les notifications en fonction des identifiants cibles et du contenu des messages
    this.filteredNotifications = this.notifications.filter(notification => {
      // Vérifier l'identifiant cible de la notification
      const targetId = notification.targetUserId || '';
      const message = notification.message.toLowerCase();
      console.log('- Notification:', notification.message, 'targetId:', targetId);
      
      // Analyser le contenu du message pour déterminer à qui il est destiné
      const isEmployeeNotification = message.includes('votre demande') || 
                                    (message.includes('a été approuvé') && !message.includes('par le chef'));
      const isAdminNotification = message.startsWith('vous avez') && (message.includes('approuvé') || message.includes('rejeté'));
      const isChefNotification = !isAdminNotification && message.includes('chef') && (message.includes('approuvé') || message.includes('rejeté'));
      
      let visible = false;
      
      // Si c'est un admin
      if (isAdmin) {
        // L'admin ne doit pas voir les notifications destinées aux employés
        if (isEmployeeNotification) {
          visible = false;
        }
        // L'admin voit les notifications qui lui sont explicitement destinées
        else if (targetId !== '') {
          visible = targetId === 'admin-approval' || 
                   targetId === 'admin-rejection' || 
                   targetId === 'others-admin-approval';
        }
        // Pour les notifications du backend sans targetId
        else {
          visible = !isEmployeeNotification && !isChefNotification;
        }
      }
      // Si c'est un chef
      else if (isChef) {
        // Le chef ne doit pas voir les notifications destinées aux employés ou à l'admin
        if (isEmployeeNotification || isAdminNotification) {
          visible = false;
        }
        // Le chef voit les notifications qui lui sont explicitement destinées
        else if (targetId !== '') {
          visible = targetId === 'chef-approval' || 
                   targetId === 'chef-rejection' || 
                   targetId === 'others-chef-approval';
        }
        // Pour les notifications du backend sans targetId
        else {
          visible = isChefNotification || (!isEmployeeNotification && !isAdminNotification);
        }
      }
      // Pour les employés
      else {
        // Les employés voient uniquement les notifications qui leur sont destinées
        if (targetId !== '') {
          visible = targetId === userId;
        }
        // Pour les notifications du backend sans targetId
        else {
          visible = isEmployeeNotification || (!isAdminNotification && !isChefNotification);
        }
      }
      
      console.log('  -> Visible:', visible);
      return visible;
    });
  }



  // Afficher/masquer le panneau de notifications
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Marquer une notification comme lue
  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
    
    // Si la notification a un lien, naviguer vers ce lien
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
      this.showNotifications = false;
    }
    
    // Mettre à jour les notifications filtrées
    this.filterNotifications();
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    // Mettre à jour les notifications filtrées
    this.filterNotifications();
  }

  // Supprimer une notification
  deleteNotification(event: Event, notificationId: string): void {
    // Empêcher la propagation pour éviter de déclencher markAsRead
    event.stopPropagation();
    
    // Supprimer la notification
    this.notificationService.deleteNotification(notificationId);
    
    // Mettre à jour les notifications filtrées
    this.filterNotifications();
  }

  // Formater la date pour l'affichage
  formatDate(date: Date): string {
    if (!date) return '';
    
    // Convertir en objet Date si c'est une chaîne
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    // Si c'est aujourd'hui, afficher l'heure ou le temps écoulé
    if (dateObj.toDateString() === now.toDateString()) {
      // Calculer la différence en minutes
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Calculer les jours de différence
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    // Format de date standard pour les dates plus anciennes
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
