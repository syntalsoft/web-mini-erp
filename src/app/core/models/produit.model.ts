export interface Produit {
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
  stockMinimum: number;
  estActif: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export interface CreateProduitDto {
  designation: string;
  reference: string;
  description?: string;
  categorieId: string;
  prixAchatHT: number;
  prixVenteHT: number;
  tauxTva: number;
  stockMinimum: number;
  estActif?: boolean;
}

export interface UpdateProduitDto {
  designation?: string;
  reference?: string;
  description?: string;
  categorieId?: string;
  prixAchatHT?: number;
  prixVenteHT?: number;
  tauxTva?: number;
  stockMinimum?: number;
  estActif?: boolean;
}
