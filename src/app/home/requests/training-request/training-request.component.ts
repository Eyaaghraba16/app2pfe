import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

export interface TrainingTheme {
  id: string;
  name: string;
  topics: string[];
}

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-training-request',
  templateUrl: './training-request.component.html',
  styleUrls: ['./training-request.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TrainingRequestComponent implements OnInit {
  departments = [
    { 
      id: 'dev',
      name: 'Développement',
      themes: [
        {
          id: 'web',
          name: 'Développement Web',
          topics: ['Angular', 'React', 'Vue.js', 'Node.js', 'PHP', 'Django']
        },
        {
          id: 'mobile',
          name: 'Développement Mobile',
          topics: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)']
        },
        {
          id: 'backend',
          name: 'Backend & API',
          topics: ['Spring Boot', 'Express.js', 'ASP.NET Core', 'GraphQL']
        },
        {
          id: 'devops',
          name: 'DevOps & Cloud',
          topics: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD']
        },
        {
          id: 'data',
          name: 'Data & BI',
          topics: ['SQL', 'NoSQL', 'Power BI', 'Tableau', 'Big Data']
        }
      ]
    }
  ];

  selectedDepartment: string = '';
  selectedTheme: string = '';
  selectedTopic: string = '';
  availableThemes: TrainingTheme[] = [];
  availableTopics: string[] = [];
  requestId: string | null = null;
  request = {
    title: '',
    organization: '',
    startDate: '',
    endDate: '',
    trainingType: '',
    objectives: '',
    cost: 0,
    documents: [] as File[]
  };

  trainingTypes = [
    'Formation technique',
    'Formation managériale',
    'Formation linguistique',
    'Autre'
  ];

  editMode = false;

  @ViewChild('trainingForm') trainingForm!: NgForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestsService: RequestsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.requestId = id;
      this.requestsService.getRequestById(id).subscribe(existingRequest => {
        if (existingRequest && existingRequest.details) {
          this.request = {
            title: existingRequest.details.title || '',
            organization: existingRequest.details.organization || '',
            startDate: existingRequest.details.startDate || '',
            endDate: existingRequest.details.endDate || '',
            trainingType: existingRequest.details.trainingType || '',
            objectives: existingRequest.details.objectives || '',
            cost: existingRequest.details.cost || 0,
            documents: []
          };
          
          if (existingRequest.details.department) {
            this.selectedDepartment = existingRequest.details.department;
            this.onDepartmentChange();
            if (existingRequest.details.theme) {
              this.selectedTheme = existingRequest.details.theme;
              this.onThemeChange();
              if (existingRequest.details.topic) {
                this.selectedTopic = existingRequest.details.topic;
              }
            }
          }
        }
      }, error => {
        console.error(error);
      });
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.request.documents = Array.from(files);
    }
  }

  onDepartmentChange() {
    const department = this.departments.find(d => d.id === this.selectedDepartment);
    if (department) {
      this.availableThemes = department.themes;
      this.selectedTheme = '';
      this.selectedTopic = '';
      this.availableTopics = [];
    }
  }

  onThemeChange() {
    const theme = this.availableThemes.find(t => t.id === this.selectedTheme);
    if (theme) {
      this.availableTopics = theme.topics;
      this.selectedTopic = '';
    }
  }

  onSubmit() {
    if (!this.trainingForm.valid) return;

    const trainingDetails = {
      ...this.request,
      department: this.selectedDepartment,
      theme: this.selectedTheme,
      topic: this.selectedTopic
    };

    const theme = this.availableThemes.find(t => t.id === this.selectedTheme);

    // Create the request data with the correct structure expected by the service methods
    const trainingRequestData = {
      title: this.request.title,
      organization: this.request.organization,
      startDate: this.request.startDate,
      endDate: this.request.endDate,
      trainingType: this.request.trainingType,
      objectives: this.request.objectives,
      cost: this.request.cost,
      department: this.selectedDepartment ? this.selectedDepartment : '',
      theme: this.selectedTheme ? this.selectedTheme : '',
      topic: this.selectedTopic ? this.selectedTopic : ''
    };

    if (this.editMode && this.requestId) {
      this.requestsService.updateTrainingRequest(this.requestId, trainingRequestData);
    } else {
      // Construction de l'objet Request pour addRequest
      const currentUser = this.authService.currentUserValue;
      const newRequest = {
        requestType: 'training',
        id: Math.random().toString(36).substr(2, 9),
        type: "Formation",
        date: new Date().toISOString(),
        status: 'En attente',
        userId: currentUser?.id || '',
        details: {
  title: this.request.title,
  organization: this.request.organization,
  startDate: this.request.startDate,
  endDate: this.request.endDate,
  trainingType: this.request.trainingType,
  objectives: this.request.objectives,
  cost: String(this.request.cost)
},
        description: `Demande de formation - ${this.request.title}`,
        createdAt: new Date().toISOString(),
        user: currentUser
      };
      this.requestsService.addRequest(newRequest);
    }

    this.router.navigate(['/home/requests']);
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}
