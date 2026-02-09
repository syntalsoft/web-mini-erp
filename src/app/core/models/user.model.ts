export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  telephone?: string;
  roles: string[];
  permissions: string[];
  estActif: boolean;
}
