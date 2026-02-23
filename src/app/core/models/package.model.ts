export interface Package {
  id: string;
  designation: string;
  reference: string;
  description?: string;
  prixAchatHT: number;
  prixVenteHT: number;
  tauxTva: number;
  estActif: boolean;
  compositions: CompositionPackage[];
  dateCreation: Date;
  dateModification: Date;
}

export interface CompositionPackage {
  id: string;
  packageId: string;
  produitId?: string;
  serviceId?: string;
  produit?: {
    id: string;
    designation: string;
    reference: string;
  };
  service?: {
    id: string;
    designation: string;
    reference: string;
  };
  quantite: number;
  ordre: number;
}

export interface CreatePackageDto {
  designation: string;
  reference: string;
  description?: string;
  prixAchatHT: number;
  prixVenteHT: number;
  tauxTva: number;
  estActif?: boolean;
  compositions?: CreateCompositionPackageDto[];
}

export interface UpdatePackageDto {
  designation?: string;
  reference?: string;
  description?: string;
  prixAchatHT?: number;
  prixVenteHT?: number;
  tauxTva?: number;
  estActif?: boolean;
  compositions?: CreateCompositionPackageDto[];
}

export interface CreateCompositionPackageDto {
  produitId?: string;
  serviceId?: string;
  quantite: number;
  ordre: number;
}
