// Script pour réinitialiser l'application et créer des données de test
// Copiez ce code et exécutez-le dans la console du navigateur

// Supprimer toutes les données du localStorage
localStorage.clear();

// Créer un compte admin
const adminUser = {
  id: 'admin-1',
  email: 'admin@company.com',
  password: 'Admin123!',
  firstName: 'Admin',
  lastName: 'RH',
  role: 'admin',
  profileImage: '',
  personalInfo: {
    dateOfBirth: new Date('1990-01-01').toISOString(),
    placeOfBirth: 'Paris',
    nationality: 'Française',
    address: '1 Rue de l\'Administration',
    phoneNumber: '0600000000',
    maritalStatus: 'single',
    cin: 'AB123456',
    numberOfChildren: 0,
    city: 'Paris',
    country: 'France',
    emergencyContact: {
      name: 'Contact Urgence',
      relationship: 'Famille',
      phoneNumber: '0600000001'
    }
  },
  professionalInfo: {
    employeeId: 'ADM001',
    department: 'Ressources Humaines',
    position: 'Responsable RH',
    joinDate: new Date('2020-01-01').toISOString(),
    contractType: 'CDI',
    salary: 50000,
    grade: 'Cadre',
    rib: 'FR7630001007941234567890185',
    bankName: 'Banque Nationale',
    cnss: 'CNSS123456',
    mutuelle: 'MUT789012'
  }
};

// Créer un compte chef
const chefUser = {
  id: 'chef-1',
  email: 'chef@aya.com',
  password: 'Chef123!',
  firstName: 'Chef',
  lastName: 'Equipe',
  role: 'chef',
  profileImage: '',
  personalInfo: {
    dateOfBirth: new Date('1985-01-01').toISOString(),
    placeOfBirth: 'Casablanca',
    nationality: 'Marocaine',
    address: '123 Rue des Chefs',
    phoneNumber: '0600000000',
    maritalStatus: 'married',
    cin: 'CD789012',
    numberOfChildren: 2,
    city: 'Casablanca',
    country: 'Maroc',
    emergencyContact: {
      name: 'Contact Urgence',
      relationship: 'Famille',
      phoneNumber: '0600000001'
    }
  },
  professionalInfo: {
    employeeId: 'CHEF001',
    department: 'Management',
    position: 'Chef d\'équipe',
    joinDate: new Date('2020-01-01').toISOString(),
    contractType: 'CDI',
    salary: 35000,
    grade: 'Senior',
    rib: 'FR7630001007941234567890186',
    bankName: 'Banque Nationale',
    cnss: 'CNSS789012',
    mutuelle: 'MUT123456'
  }
};

// Créer un utilisateur normal
const normalUser = {
  id: 'user-1',
  email: 'user@aya.com',
  password: 'User123!',
  firstName: 'Utilisateur',
  lastName: 'Normal',
  role: 'user',
  profileImage: '',
  personalInfo: {
    dateOfBirth: new Date('1995-01-01').toISOString(),
    placeOfBirth: 'Lyon',
    nationality: 'Française',
    address: '456 Rue des Utilisateurs',
    phoneNumber: '0600000002',
    maritalStatus: 'single',
    cin: 'EF123456',
    numberOfChildren: 0,
    city: 'Lyon',
    country: 'France',
    emergencyContact: {
      name: 'Contact Urgence',
      relationship: 'Famille',
      phoneNumber: '0600000003'
    }
  },
  professionalInfo: {
    employeeId: 'USER001',
    department: 'Développement',
    position: 'Développeur',
    joinDate: new Date('2022-01-01').toISOString(),
    contractType: 'CDI',
    salary: 30000,
    grade: 'Junior',
    rib: 'FR7630001007941234567890187',
    bankName: 'Banque Nationale',
    cnss: 'CNSS789013',
    mutuelle: 'MUT123457'
  }
};

// Stocker les utilisateurs dans le localStorage
const users = [adminUser, chefUser, normalUser];
localStorage.setItem('users', JSON.stringify(users));

// Créer des demandes de test
const testRequests = [
  {
    id: 'req-1',
    userId: 'user-1',
    type: 'congé',
    description: 'Demande de congé annuel',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      leaveType: 'annuel',
      dayPart: 'full',
      reason: 'Vacances d\'été'
    }
  },
  {
    id: 'req-2',
    userId: 'user-1',
    type: 'formation',
    description: 'Demande de formation en développement web',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      startDate: '2025-06-15',
      endDate: '2025-06-20',
      title: 'Formation Angular avancé',
      organization: 'Tech Academy',
      trainingType: 'technique',
      objectives: 'Améliorer les compétences en Angular',
      cost: 1500
    }
  },
  {
    id: 'req-3',
    userId: 'user-1',
    type: 'document',
    description: 'Demande d\'attestation de travail',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      documentType: 'attestation',
      urgency: true,
      purpose: 'Démarches administratives'
    }
  }
];

// Stocker les demandes dans le localStorage
localStorage.setItem('requests', JSON.stringify(testRequests));

// Connecter automatiquement en tant que chef
localStorage.setItem('currentUser', JSON.stringify(chefUser));
localStorage.setItem('isLoggedIn', 'true');

console.log('Application réinitialisée avec succès !');
console.log('Utilisateurs créés :', users.length);
console.log('Demandes créées :', testRequests.length);
console.log('Vous êtes maintenant connecté en tant que chef.');
console.log('Rafraîchissez la page pour voir les changements.');
