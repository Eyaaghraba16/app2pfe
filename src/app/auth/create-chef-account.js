// Script pour créer un compte chef directement dans le localStorage
// Copiez ce code et exécutez-le dans la console du navigateur

// Créer un objet utilisateur chef
const chefUser = {
  id: "chef-" + Date.now(),
  email: "chef@aya.com",
  firstName: "Chef",
  lastName: "Equipe",
  role: "chef",
  profileImage: "",
  personalInfo: {
    cin: "AB123456",
    dateOfBirth: "1985-01-01",
    placeOfBirth: "Casablanca",
    nationality: "Marocaine",
    maritalStatus: "married",
    numberOfChildren: 2,
    address: "123 Rue des Chefs",
    city: "Casablanca",
    country: "Maroc",
    phoneNumber: "0600000000",
    emergencyContact: {
      name: "Contact Urgence",
      relationship: "Famille",
      phoneNumber: "0600000001"
    }
  },
  professionalInfo: {
    employeeId: "CHEF001",
    department: "Management",
    position: "Chef d'équipe",
    grade: "Senior",
    joinDate: "2020-01-01",
    contractType: "CDI",
    salary: 15000,
    rib: "FR7630001007941234567890185",
    bankName: "Banque Nationale",
    cnss: "CNSS123456",
    mutuelle: "MUT789012"
  }
};

// Stocker l'utilisateur comme utilisateur actuel
localStorage.setItem('currentUser', JSON.stringify(chefUser));

// Vérifier si un tableau d'utilisateurs existe déjà
let users = JSON.parse(localStorage.getItem('users') || '[]');

// Vérifier si le chef existe déjà dans le tableau
const chefExists = users.some(user => user.email === chefUser.email);

// Si le chef n'existe pas, l'ajouter
if (!chefExists) {
  users.push(chefUser);
  localStorage.setItem('users', JSON.stringify(users));
}

// Créer un token JWT factice (pour simuler l'authentification)
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjaGVmLTEiLCJlbWFpbCI6ImNoZWZAYXlhLmNvbSIsInJvbGUiOiJjaGVmIiwiaWF0IjoxNjE5NzEyMDAwLCJleHAiOjE2MTk3OTg0MDB9.8J7qT8pZ8z3Z1Z3Z1Z3Z1Z3Z1Z3Z1Z3Z1Z3Z1Z3Z1Z3";
localStorage.setItem('token', fakeToken);

console.log("Compte chef créé avec succès !");
console.log("Vous êtes maintenant connecté en tant que chef.");
console.log("Rafraîchissez la page pour voir les changements.");
