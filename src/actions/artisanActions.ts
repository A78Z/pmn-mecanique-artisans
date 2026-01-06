"use server";

/**
 * Server Actions for Artisan CRUD operations
 * These actions run on the server and interact with Back4App
 */

import Parse from '@/lib/parseServer';
import { ArtisanData } from '@/types/artisan';

// ═══════════════════════════════════════════════════════════════
// CREATE - Submit new artisan
// ═══════════════════════════════════════════════════════════════

export async function createArtisan(data: ArtisanData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const Artisan = Parse.Object.extend('Artisan');
        const artisan = new Artisan();

        // Personal information
        artisan.set('prenom', data.prenom);
        artisan.set('nom', data.nom);
        artisan.set('genre', data.genre);
        artisan.set('telephone', data.telephone);
        artisan.set('cni', data.cni);
        artisan.set('validiteCni', data.validiteCni ? new Date(data.validiteCni) : null);
        artisan.set('carteArtisan', data.carteArtisan);
        artisan.set('validiteCarteArtisan', data.validiteCarteArtisan ? new Date(data.validiteCarteArtisan) : null);

        // Location
        artisan.set('adresse', data.adresse);
        artisan.set('region', data.region);
        artisan.set('departement', data.departement);
        artisan.set('commune', data.commune);
        artisan.set('quartier', data.quartier);

        // Professional information
        artisan.set('corpsMetier', data.corpsMetier);
        artisan.set('entreprise', data.entreprise);
        artisan.set('ninea', data.ninea);
        artisan.set('adresseEntreprise', data.adresseEntreprise);
        artisan.set('nbEmployes', data.nbEmployes);
        artisan.set('experience', data.experience);

        // Financial history
        artisan.set('financementEtat', data.financementEtat);
        artisan.set('financementEtatStructure', data.financementEtatStructure || '');
        artisan.set('financementEtatAnnee', data.financementEtatAnnee || '');
        artisan.set('pretBanque', data.pretBanque);
        artisan.set('pretBanqueInstitution', data.pretBanqueInstitution || '');
        artisan.set('pretBanqueObjet', data.pretBanqueObjet || '');

        // Save to Back4App
        const result = await artisan.save();

        console.log('Artisan created:', result.id);
        return { success: true, id: result.id };

    } catch (error) {
        console.error('Error creating artisan:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// READ - Fetch artisans with optional filters
// ═══════════════════════════════════════════════════════════════

export interface ArtisanFilters {
    region?: string;
    departement?: string;
    commune?: string;
    quartier?: string;
    corpsMetier?: string;
    genre?: string;
    search?: string;
}

export interface ArtisanRecord {
    id: string;
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
    dateInscription: string;
}

export async function getArtisans(filters?: ArtisanFilters): Promise<{ success: boolean; artisans: ArtisanRecord[]; error?: string }> {
    try {
        const Artisan = Parse.Object.extend('Artisan');
        const query = new Parse.Query(Artisan);

        // Apply filters
        if (filters) {
            if (filters.region) {
                query.equalTo('region', filters.region);
            }
            if (filters.departement) {
                query.equalTo('departement', filters.departement);
            }
            if (filters.commune) {
                query.equalTo('commune', filters.commune);
            }
            if (filters.quartier) {
                query.contains('quartier', filters.quartier);
            }
            if (filters.corpsMetier) {
                query.containedIn('corpsMetier', [filters.corpsMetier]);
            }
            if (filters.genre) {
                query.equalTo('genre', filters.genre);
            }
            if (filters.search) {
                // Search by name or phone
                const prenomQuery = new Parse.Query(Artisan);
                prenomQuery.contains('prenom', filters.search);

                const nomQuery = new Parse.Query(Artisan);
                nomQuery.contains('nom', filters.search);

                const phoneQuery = new Parse.Query(Artisan);
                phoneQuery.contains('telephone', filters.search);

                // Combine with OR
                const searchQuery = Parse.Query.or(prenomQuery, nomQuery, phoneQuery);

                // Apply other filters to search query
                if (filters.region) searchQuery.equalTo('region', filters.region);
                if (filters.departement) searchQuery.equalTo('departement', filters.departement);

                // Use this instead
                const results = await searchQuery.find();
                const artisans = results.map(mapParseObjectToArtisan);
                return { success: true, artisans };
            }
        }

        // Order by creation date (newest first)
        query.descending('createdAt');

        // Limit for performance
        query.limit(1000);

        const results = await query.find();
        const artisans = results.map(mapParseObjectToArtisan);

        return { success: true, artisans };

    } catch (error) {
        console.error('Error fetching artisans:', error);
        return {
            success: false,
            artisans: [],
            error: error instanceof Error ? error.message : 'Erreur lors de la récupération des données'
        };
    }
}

// Helper to map Parse object to plain object
function mapParseObjectToArtisan(obj: Parse.Object): ArtisanRecord {
    return {
        id: obj.id || '',
        prenom: obj.get('prenom') || '',
        nom: obj.get('nom') || '',
        genre: obj.get('genre') || '',
        telephone: obj.get('telephone') || '',
        cni: obj.get('cni') || '',
        validiteCni: obj.get('validiteCni')?.toISOString?.() || '',
        carteArtisan: obj.get('carteArtisan') || '',
        validiteCarteArtisan: obj.get('validiteCarteArtisan')?.toISOString?.() || '',
        adresse: obj.get('adresse') || '',
        region: obj.get('region') || '',
        departement: obj.get('departement') || '',
        commune: obj.get('commune') || '',
        quartier: obj.get('quartier') || '',
        corpsMetier: obj.get('corpsMetier') || [],
        entreprise: obj.get('entreprise') || '',
        ninea: obj.get('ninea') || '',
        adresseEntreprise: obj.get('adresseEntreprise') || '',
        nbEmployes: obj.get('nbEmployes') || '',
        experience: obj.get('experience') || '',
        financementEtat: obj.get('financementEtat') || 'Non',
        financementEtatStructure: obj.get('financementEtatStructure') || '',
        financementEtatAnnee: obj.get('financementEtatAnnee') || '',
        pretBanque: obj.get('pretBanque') || 'Non',
        pretBanqueInstitution: obj.get('pretBanqueInstitution') || '',
        pretBanqueObjet: obj.get('pretBanqueObjet') || '',
        dateInscription: obj.get('createdAt')?.toISOString?.() || new Date().toISOString(),
    };
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Remove artisan by ID
// ═══════════════════════════════════════════════════════════════

export async function deleteArtisan(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const Artisan = Parse.Object.extend('Artisan');
        const query = new Parse.Query(Artisan);

        const artisan = await query.get(id);
        await artisan.destroy();

        console.log('Artisan deleted:', id);
        return { success: true };

    } catch (error) {
        console.error('Error deleting artisan:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur lors de la suppression'
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// STATS - Get statistics
// ═══════════════════════════════════════════════════════════════

export interface ArtisanStats {
    total: number;
    byRegion: Record<string, number>;
    byCorpsMetier: Record<string, number>;
    byGenre: Record<string, number>;
}

export async function getArtisanStats(): Promise<{ success: boolean; stats: ArtisanStats; error?: string }> {
    try {
        const Artisan = Parse.Object.extend('Artisan');
        const query = new Parse.Query(Artisan);

        // Get all artisans for stats calculation
        query.limit(10000);
        const results = await query.find();

        const stats: ArtisanStats = {
            total: results.length,
            byRegion: {},
            byCorpsMetier: {},
            byGenre: {},
        };

        results.forEach((artisan: any) => {
            // Count by region
            const region = artisan.get('region') || 'Non spécifié';
            stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;

            // Count by corps de métier
            const metiers = artisan.get('corpsMetier') || [];
            metiers.forEach((metier: string) => {
                stats.byCorpsMetier[metier] = (stats.byCorpsMetier[metier] || 0) + 1;
            });

            // Count by genre
            const genre = artisan.get('genre') || 'Non spécifié';
            stats.byGenre[genre] = (stats.byGenre[genre] || 0) + 1;
        });

        return { success: true, stats };

    } catch (error) {
        console.error('Error getting stats:', error);
        return {
            success: false,
            stats: { total: 0, byRegion: {}, byCorpsMetier: {}, byGenre: {} },
            error: error instanceof Error ? error.message : 'Erreur lors du calcul des statistiques'
        };
    }
}
