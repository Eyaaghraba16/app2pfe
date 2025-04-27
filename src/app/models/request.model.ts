export interface Request {
  requestType: string;
  id: string;
  type: string;
  date: string;
  status: string;
  userId: string;
  details: any;
  description?: string;
  
  // Champs pour le workflow d'approbation à deux niveaux
  chefObservation?: string;
  chefProcessedBy?: string;
  chefProcessedDate?: string;
  
  // Champs pour la réponse de l'admin
  adminResponse?: string;
  adminProcessedBy?: string;
  adminProcessedDate?: string;
  
  // Pour la compatibilité avec le code existant
  chefResponse?: string;
  response?: string;
  processedBy?: string;
  
  createdAt: string;
  updated_at?: Date;
  user?: {
    id: string;
    name: string;
    firstname: string;
    lastname: string;
    role: string;
  };
  professional_info?: {
    department: string;
    position: string;
  };
}
