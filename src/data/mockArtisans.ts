/**
 * Mock data for artisan mechanics
 * Data structured for the admin dashboard
 */

export interface Artisan {
    id: string;
    prenom: string;
    nom: string;
    genre: 'Homme' | 'Femme';
    telephone: string;
    cni: string;
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
    financementEtat: boolean;
    financementEtatStructure?: string;
    financementEtatAnnee?: string;
    pretBanque: boolean;
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

// Prénoms sénégalais
const PRENOMS_HOMMES = ['Mamadou', 'Ibrahima', 'Ousmane', 'Moussa', 'Abdoulaye', 'Cheikh', 'Modou', 'Babacar', 'Serigne', 'Pape', 'Amadou', 'Aliou', 'El Hadji', 'Saliou', 'Djibril'];
const PRENOMS_FEMMES = ['Fatou', 'Aminata', 'Mariama', 'Aissatou', 'Khady', 'Ndèye', 'Awa', 'Coumba', 'Dieynaba', 'Oumou'];
const NOMS = ['Diallo', 'Fall', 'Ndiaye', 'Diop', 'Sow', 'Ba', 'Sy', 'Gueye', 'Sarr', 'Mbaye', 'Faye', 'Thiam', 'Cissé', 'Ndour', 'Kane', 'Seck', 'Diouf', 'Lo', 'Camara', 'Dieng'];

// Entreprises fictives
const ENTREPRISES = [
    'Garage Central', 'Auto Service Dakar', 'Mécanique Express', 'Garage du Progrès',
    'Auto Réparation Moderne', 'Garage Sénégal Auto', 'Mécanique Pro', 'Auto Sénégal Services',
    'Garage Excellence', 'Atelier Mécanique Diop', 'Garage Ndiaye & Fils', 'Auto Soluton',
    'Garage de la Paix', 'Mécanique Générale', 'Auto Tech Services', 'Garage Premium',
    'Atelier Fall', 'Mécanique du Littoral', 'Garage Thiès Auto', 'Service Auto Plus'
];

// Régions et leurs départements (simplifié)
const REGIONS_DEPTS: Record<string, string[]> = {
    'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
    'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
    'Diourbel': ['Diourbel', 'Bambey', 'Mbacké'],
    'Saint-Louis': ['Saint-Louis', 'Dagana', 'Podor'],
    'Kaolack': ['Kaolack', 'Guinguinéo', 'Nioro du Rip'],
    'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
    'Ziguinchor': ['Ziguinchor', 'Bignona', 'Oussouye'],
    'Louga': ['Louga', 'Kébémer', 'Linguère'],
    'Tambacounda': ['Tambacounda', 'Bakel', 'Goudiry', 'Koumpentoum'],
    'Kolda': ['Kolda', 'Vélingara', 'Médina Yoro Foulah'],
    'Matam': ['Matam', 'Kanel', 'Ranérou'],
    'Kaffrine': ['Kaffrine', 'Birkelane', 'Koungheul', 'Malem Hodar'],
    'Kédougou': ['Kédougou', 'Salémata', 'Saraya'],
    'Sédhiou': ['Sédhiou', 'Bounkiling', 'Goudomp']
};

// Générer un ID unique
const generateId = (index: number): string => {
    return `ART-${String(index + 1).padStart(4, '0')}`;
};

// Générer un numéro de téléphone sénégalais
const generatePhone = (): string => {
    const prefixes = ['77', '78', '76', '70', '75'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(1000000 + Math.random() * 9000000);
    return `+221 ${prefix} ${String(number).slice(0, 3)} ${String(number).slice(3, 5)} ${String(number).slice(5)}`;
};

// Générer un CNI
const generateCNI = (): string => {
    return `1${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
};

// Générer un NINEA
const generateNINEA = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    return `${Math.floor(10000 + Math.random() * 90000)}${randomLetter()}${randomLetter()}${randomLetter()}`;
};

// Générer une date d'inscription dans les 2 dernières années
const generateDateInscription = (): string => {
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
    const date = new Date(randomTime);
    return date.toISOString().split('T')[0];
};

// Générer les données mock
const generateMockArtisans = (): Artisan[] => {
    const artisans: Artisan[] = [];
    const regions = Object.keys(REGIONS_DEPTS);

    for (let i = 0; i < 75; i++) {
        const isWoman = Math.random() < 0.15; // 15% de femmes
        const prenoms = isWoman ? PRENOMS_FEMMES : PRENOMS_HOMMES;
        const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
        const nom = NOMS[Math.floor(Math.random() * NOMS.length)];

        const region = regions[Math.floor(Math.random() * regions.length)];
        const departements = REGIONS_DEPTS[region];
        const departement = departements[Math.floor(Math.random() * departements.length)];

        // Générer 1-3 corps de métier
        const nbMetiers = 1 + Math.floor(Math.random() * 3);
        const shuffledMetiers = [...CORPS_METIERS].sort(() => Math.random() - 0.5);
        const corpsMetier = shuffledMetiers.slice(0, nbMetiers);

        const hasFinancement = Math.random() < 0.2;
        const hasPret = Math.random() < 0.25;

        artisans.push({
            id: generateId(i),
            prenom,
            nom,
            genre: isWoman ? 'Femme' : 'Homme',
            telephone: generatePhone(),
            cni: generateCNI(),
            region,
            departement,
            commune: `Commune ${departement}`,
            quartier: ['Centre', 'Nord', 'Sud', 'Est', 'Ouest', 'Médina', 'HLM'][Math.floor(Math.random() * 7)],
            adresse: `Rue ${Math.floor(1 + Math.random() * 50)}, ${departement}`,
            corpsMetier,
            entreprise: ENTREPRISES[Math.floor(Math.random() * ENTREPRISES.length)],
            ninea: generateNINEA(),
            adresseEntreprise: `Zone Artisanale, ${departement}`,
            nbEmployes: ['1-5', '6-10', '11-20', '21-50', '+50'][Math.floor(Math.random() * 5)],
            experience: ['0-2', '3-5', '6-10', '11-15', '16-20', '+20'][Math.floor(Math.random() * 6)],
            dateInscription: generateDateInscription(),
            financementEtat: hasFinancement,
            financementEtatStructure: hasFinancement ? 'ADEPME' : undefined,
            financementEtatAnnee: hasFinancement ? String(2020 + Math.floor(Math.random() * 5)) : undefined,
            pretBanque: hasPret,
            pretBanqueInstitution: hasPret ? ['BICIS', 'CBAO', 'BOA', 'Ecobank'][Math.floor(Math.random() * 4)] : undefined,
            pretBanqueObjet: hasPret ? 'Équipement atelier' : undefined
        });
    }

    return artisans.sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime());
};

export const mockArtisans: Artisan[] = generateMockArtisans();

// Fonctions utilitaires pour les statistiques
export const getArtisansByRegion = () => {
    const byRegion: Record<string, number> = {};
    mockArtisans.forEach(a => {
        byRegion[a.region] = (byRegion[a.region] || 0) + 1;
    });
    return Object.entries(byRegion)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);
};

export const getArtisansByMetier = () => {
    const byMetier: Record<string, number> = {};
    mockArtisans.forEach(a => {
        a.corpsMetier.forEach(m => {
            byMetier[m] = (byMetier[m] || 0) + 1;
        });
    });
    return Object.entries(byMetier)
        .map(([metier, count]) => ({ metier, count }))
        .sort((a, b) => b.count - a.count);
};

export const getArtisansByGenre = () => {
    const hommes = mockArtisans.filter(a => a.genre === 'Homme').length;
    const femmes = mockArtisans.filter(a => a.genre === 'Femme').length;
    return { hommes, femmes };
};
