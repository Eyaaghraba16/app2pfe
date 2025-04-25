export interface PersonalInfo {
  cin: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  numberOfChildren: number;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface ProfessionalInfo {
  employeeId: string;
  department: string;
  position: string;
  grade: string;
  joinDate: string;
  contractType: 'CDI' | 'CDD' | 'ANAPEC' | 'Stage';
  salary: number;
  rib: string;
  bankName: string;
  cnss: string;
  mutuelle: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'chef' | 'admin';
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  profileImage?: string;
}
