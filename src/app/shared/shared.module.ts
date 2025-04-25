import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    NotificationsComponent
  ]
})
export class SharedModule { }
