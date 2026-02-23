export interface Service {
  id: string;
  designation: string;
  reference: string;
  description?: string;
  categorieId: string;
  categorie?: {
    id: string;
    libelle: string;
  };
  prixAchatHT: number;
  prixVenteHT: number;
  tauxTva: number;
  estActif: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export interface CreateServiceDto {
  designation: string;
  reference: string;
  description?: string;
  categorieId: string;
  prixAchatHT: number;
  prixVenteHT: number;
  tauxTva: number;
  estActif?: boolean;
}

export interface UpdateServiceDto {
  designation?: string;
  reference?: string;
  description?: string;
  categorieId?: string;
  prixAchatHT?: number;
  prixVenteHT?: number;
  tauxTva?: number;
  estActif?: boolean;
}
