import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-simple-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simple-admin.component.html',
  styleUrls: ['./simple-admin.component.scss']
})
export class SimpleAdminComponent {
  title = 'Page d\'administration';
}
