/**
 * Shared types for Artisan data
 * Used by both the admin dashboard and form components
 * Compatible with Back4App data structure
 */

export interface Artisan {
    id: string;
    prenom: string;
    nom: string;
    genre: string;
    telephone: string;
    cni: string;
    validiteCni?: string;
    carteArtisan: string;
    validiteCarteArtisan?: string;
    region: string;
    departement: string;
    commune: string;
    quartier: string;
    adresse: string;
    corpsMetier: string[];
    entreprise: string;
    ninea: string;
    adresseEntreprise: string;
    nbEmployes: string;
    experience: string;
    dateInscription: string;
    financementEtat: boolean | string;
    financementEtatStructure?: string;
    financementEtatAnnee?: string;
    pretBanque: boolean | string;
    pretBanqueInstitution?: string;
    pretBanqueObjet?: string;
}

// Corps de métier disponibles
export const CORPS_METIERS = [
    'Vulgarisateur',
    'Mécanicien auto',
    'Électricien auto',
    'Tôlier',
    'Peinture auto',
    'Technicien froid auto'
] as const;

export type CorpsMetier = typeof CORPS_METIERS[number];

// Data structure for creating/updating an artisan (no ID)
export interface ArtisanData {
    prenom: string;
    nom: string;
    genre: string;
    telephone: string;
    cni: string;
    validiteCni: string;
    carteArtisan: string;
    validiteCarteArtisan: string;
    adresse: string;
    region: string;
    departement: string;
    commune: string;
    quartier: string;
    corpsMetier: string[];
    entreprise: string;
    ninea: string;
    adresseEntreprise: string;
    nbEmployes: string;
    experience: string;
    financementEtat: string;
    financementEtatStructure: string;
    financementEtatAnnee: string;
    pretBanque: string;
    pretBanqueInstitution: string;
    pretBanqueObjet: string;
}
