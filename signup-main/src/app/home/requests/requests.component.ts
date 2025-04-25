import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestsService, Request } from './requests.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: Request[] = [];

  constructor(
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    this.requestsService.getRequests().subscribe(requests => {
      this.requests = requests;
    });
  }

  createNewRequest() {
    this.router.navigate(['/home/requests/new']);
  }

  viewDetails(id: number) {
    this.router.navigate(['/home/requests', id]);
  }

  editRequest(id: number, type: string) {
    switch (type) {
      case 'Congé annuel':
        this.router.navigate(['/home/requests/leave/edit', id]);
        break;
      case 'Formation':
        this.router.navigate(['/home/requests/training/edit', id]);
        break;
      case 'Attestation de travail':
        this.router.navigate(['/home/requests/certificate/edit', id]);
        break;
    }
  }
}
