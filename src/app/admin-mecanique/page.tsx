"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Users, Loader2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { jsPDF } from 'jspdf';

import { StatsCards } from '@/components/admin/StatsCards';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { AdminTable } from '@/components/admin/AdminTable';
import { Pagination } from '@/components/admin/Pagination';
import { ArtisanDetailModal } from '@/components/admin/ArtisanDetailModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

// Import server actions for Back4App integration
import { getArtisans, deleteArtisan, ArtisanRecord, ArtisanFilters as ServerFilters } from '@/actions/artisanActions';
import { useAuth } from '@/contexts/AuthContext';

// Corps de métier disponibles (for filters)
const CORPS_METIERS = [
    'Vulgarisateur',
    'Mécanicien auto',
    'Électricien auto',
    'Tôlier',
    'Peinture auto',
    'Technicien froid auto'
] as const;

// Adapter type for compatibility with existing components
export interface Artisan {
    id: string;
    prenom: string;
    nom: string;
    genre: 'Homme' | 'Femme' | string;
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

// Convert ArtisanRecord from Back4App to local Artisan type
function convertToArtisan(record: ArtisanRecord): Artisan {
    return {
        id: record.id,
        prenom: record.prenom,
        nom: record.nom,
        genre: record.genre as 'Homme' | 'Femme',
        telephone: record.telephone,
        cni: record.cni,
        validiteCni: record.validiteCni,
        carteArtisan: record.carteArtisan,
        validiteCarteArtisan: record.validiteCarteArtisan,
        region: record.region,
        departement: record.departement,
        commune: record.commune,
        quartier: record.quartier,
        adresse: record.adresse,
        corpsMetier: record.corpsMetier,
        entreprise: record.entreprise,
        ninea: record.ninea,
        adresseEntreprise: record.adresseEntreprise,
        nbEmployes: record.nbEmployes,
        experience: record.experience,
        dateInscription: record.dateInscription ? record.dateInscription.split('T')[0] : new Date().toISOString().split('T')[0],
        financementEtat: record.financementEtat === 'Oui',
        financementEtatStructure: record.financementEtatStructure,
        financementEtatAnnee: record.financementEtatAnnee,
        pretBanque: record.pretBanque === 'Oui',
        pretBanqueInstitution: record.pretBanqueInstitution,
        pretBanqueObjet: record.pretBanqueObjet,
    };
}

// Filter state type
interface FilterState {
    search: string;
    region: string;
    departement: string;
    corpsMetier: string;
    genre: string;
}

/**
 * Calculate statistics from a list of artisans
 * Used for dynamic stats based on filtered data
 */
function calculateStats(artisansList: Artisan[]) {
    // By Region
    const byRegion: Record<string, number> = {};
    artisansList.forEach(a => {
        const region = a.region || 'Non spécifié';
        byRegion[region] = (byRegion[region] || 0) + 1;
    });
    const regionStats = Object.entries(byRegion)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);

    // By Métier
    const byMetier: Record<string, number> = {};
    artisansList.forEach(a => {
        (a.corpsMetier || []).forEach(m => {
            byMetier[m] = (byMetier[m] || 0) + 1;
        });
    });
    const metierStats = Object.entries(byMetier)
        .map(([metier, count]) => ({ metier, count }))
        .sort((a, b) => b.count - a.count);

    // By Genre
    const hommes = artisansList.filter(a => a.genre === 'Homme').length;
    const femmes = artisansList.filter(a => a.genre === 'Femme').length;

    return {
        total: artisansList.length,
        byRegion: regionStats,
        byMetier: metierStats,
        byGenre: { hommes, femmes }
    };
}

/**
 * Generate PDF report for filtered artisans list
 */
function generateListPDF(artisans: Artisan[], activeFilters: FilterState) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Colors
    const greenDark = [26, 90, 58] as const;
    const gray = [100, 100, 100] as const;
    const black = [30, 30, 30] as const;

    let y = 15;

    // ══════════════════════════════════════════
    // HEADER
    // ══════════════════════════════════════════
    doc.setFillColor(...greenDark);
    doc.rect(0, 0, 297, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJET MOBILIER NATIONAL', 148.5, 12, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Liste des artisans – Métiers mécaniques', 148.5, 22, { align: 'center' });

    y = 40;

    // ══════════════════════════════════════════
    // FILTER INFO & DATE
    // ══════════════════════════════════════════
    doc.setTextColor(...gray);
    doc.setFontSize(9);

    // Active filters
    const filterParts: string[] = [];
    if (activeFilters.region) filterParts.push(`Région: ${activeFilters.region}`);
    if (activeFilters.departement) filterParts.push(`Département: ${activeFilters.departement}`);
    if (activeFilters.corpsMetier) filterParts.push(`Métier: ${activeFilters.corpsMetier}`);
    if (activeFilters.genre) filterParts.push(`Genre: ${activeFilters.genre}`);
    if (activeFilters.search) filterParts.push(`Recherche: "${activeFilters.search}"`);

    const filterText = filterParts.length > 0
        ? `Filtres actifs: ${filterParts.join(' | ')}`
        : 'Aucun filtre actif (données complètes)';

    doc.text(filterText, 15, y);

    // Date and count
    const dateStr = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(`Exporté le ${dateStr} | ${artisans.length} artisan(s)`, 282, y, { align: 'right' });

    y += 10;

    // ══════════════════════════════════════════
    // TABLE HEADER
    // ══════════════════════════════════════════
    const columns = [
        { label: 'ID', width: 22, x: 15 },
        { label: 'Nom complet', width: 45, x: 37 },
        { label: 'Genre', width: 18, x: 82 },
        { label: 'Téléphone', width: 38, x: 100 },
        { label: 'Région', width: 35, x: 138 },
        { label: 'Département', width: 35, x: 173 },
        { label: 'Corps de métier', width: 50, x: 208 },
        { label: 'Entreprise', width: 40, x: 258 }
    ];

    doc.setFillColor(240, 245, 240);
    doc.rect(15, y, 267, 8, 'F');

    doc.setTextColor(...greenDark);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    columns.forEach(col => {
        doc.text(col.label, col.x, y + 5.5);
    });

    y += 10;

    // ══════════════════════════════════════════
    // TABLE ROWS
    // ══════════════════════════════════════════
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...black);

    const maxRows = 25; // Rows per page
    let rowCount = 0;

    artisans.forEach((artisan, index) => {
        // Check if we need a new page
        if (rowCount >= maxRows) {
            doc.addPage();
            y = 20;
            rowCount = 0;

            // Repeat header on new page
            doc.setFillColor(240, 245, 240);
            doc.rect(15, y, 267, 8, 'F');
            doc.setTextColor(...greenDark);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            columns.forEach(col => {
                doc.text(col.label, col.x, y + 5.5);
            });
            y += 10;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...black);
        }

        // Zebra striping
        if (index % 2 === 1) {
            doc.setFillColor(250, 250, 250);
            doc.rect(15, y - 1, 267, 6, 'F');
        }

        doc.setFontSize(7);
        doc.text(artisan.id.substring(0, 12), 15, y + 3);
        doc.text(`${artisan.prenom} ${artisan.nom}`.substring(0, 25), 37, y + 3);
        doc.text(artisan.genre || '', 82, y + 3);
        doc.text(artisan.telephone || '', 100, y + 3);
        doc.text((artisan.region || '').substring(0, 18), 138, y + 3);
        doc.text((artisan.departement || '').substring(0, 18), 173, y + 3);
        doc.text((artisan.corpsMetier || []).slice(0, 2).join(', ').substring(0, 28), 208, y + 3);
        doc.text((artisan.entreprise || '').substring(0, 22), 258, y + 3);

        y += 6;
        rowCount++;
    });

    // ══════════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════════
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text(
            `Page ${i} / ${pageCount} | © ${new Date().getFullYear()} Projet Mobilier National`,
            148.5,
            200,
            { align: 'center' }
        );
    }

    // Save
    const filename = `liste-artisans-mecanique-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}

// ═══════════════════════════════════════════════════════════════
// LOGOUT BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════

function LogoutButton() {
    const { logout, user } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            // Redirect handled by AuthGuard in layout
            window.location.href = '/admin-mecanique/login';
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            title={`Déconnexion${user ? ` (${user.email})` : ''}`}
        >
            <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Déconnexion</span>
        </button>
    );
}

export default function AdminMecaniquePage() {
    // ═══════════════════════════════════════════════════════════════
    // STATE - Connected to Back4App
    // ═══════════════════════════════════════════════════════════════
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        region: '',
        departement: '',
        corpsMetier: '',
        genre: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal states
    const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
    const [artisanToDelete, setArtisanToDelete] = useState<Artisan | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // LOAD DATA FROM BACK4APP
    // ═══════════════════════════════════════════════════════════════
    const loadArtisans = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getArtisans();

            if (result.success) {
                const converted = result.artisans.map(convertToArtisan);
                setArtisans(converted);
            } else {
                setError(result.error || 'Erreur lors du chargement des données');
            }
        } catch (err) {
            console.error('Load error:', err);
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        loadArtisans();
    }, [loadArtisans]);

    // ═══════════════════════════════════════════════════════════════
    // DERIVED DATA
    // ═══════════════════════════════════════════════════════════════

    // Get unique regions from data
    const regions = useMemo(() => {
        const regionSet = new Set(artisans.map(a => a.region).filter(Boolean));
        return Array.from(regionSet).sort();
    }, [artisans]);

    // Get departements for selected region
    const departements = useMemo(() => {
        if (!filters.region) return [];
        const deptSet = new Set(
            artisans
                .filter(a => a.region === filters.region)
                .map(a => a.departement)
                .filter(Boolean)
        );
        return Array.from(deptSet).sort();
    }, [artisans, filters.region]);

    // Filtered artisans (client-side filtering for responsiveness)
    const filteredArtisans = useMemo(() => {
        return artisans.filter(a => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    (a.prenom || '').toLowerCase().includes(searchLower) ||
                    (a.nom || '').toLowerCase().includes(searchLower) ||
                    (a.telephone || '').includes(filters.search);
                if (!matchesSearch) return false;
            }

            // Region filter
            if (filters.region && a.region !== filters.region) return false;

            // Departement filter
            if (filters.departement && a.departement !== filters.departement) return false;

            // Corps de métier filter
            if (filters.corpsMetier && !(a.corpsMetier || []).includes(filters.corpsMetier)) return false;

            // Genre filter
            if (filters.genre && a.genre !== filters.genre) return false;

            return true;
        });
    }, [artisans, filters]);

    // Statistics - Dynamic based on filtered data
    const stats = useMemo(() => calculateStats(filteredArtisans), [filteredArtisans]);

    // Pagination
    const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
    const paginatedArtisans = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredArtisans.slice(start, start + itemsPerPage);
    }, [filteredArtisans, currentPage, itemsPerPage]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    // Reset to page 1 when filters change
    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    // Handle items per page change
    const handleItemsPerPageChange = useCallback((items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    }, []);

    // View artisan details
    const handleView = useCallback((artisan: Artisan) => {
        setSelectedArtisan(artisan);
    }, []);

    // Edit artisan (placeholder)
    const handleEdit = useCallback((artisan: Artisan) => {
        console.log('Edit artisan:', artisan.id);
        alert(`Modification de ${artisan.prenom} ${artisan.nom} - Fonctionnalité à venir`);
    }, []);

    // Initiate delete
    const handleDelete = useCallback((artisan: Artisan) => {
        setArtisanToDelete(artisan);
    }, []);

    // Confirm delete - Connected to Back4App
    const confirmDelete = useCallback(async () => {
        if (!artisanToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteArtisan(artisanToDelete.id);

            if (result.success) {
                // Remove from local state immediately for responsiveness
                setArtisans(prev => prev.filter(a => a.id !== artisanToDelete.id));
                setArtisanToDelete(null);
            } else {
                alert(`Erreur: ${result.error}`);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    }, [artisanToDelete]);

    // ═══════════════════════════════════════════════════════════════
    // EXPORT FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    // Export CSV (filtered data)
    const handleExportCSV = useCallback(() => {
        const headers = ['ID', 'Prénom', 'Nom', 'Genre', 'Téléphone', 'Région', 'Département', 'Corps de métier', 'Entreprise', 'Date inscription'];
        const rows = filteredArtisans.map(a => [
            a.id,
            a.prenom,
            a.nom,
            a.genre,
            a.telephone,
            a.region,
            a.departement,
            (a.corpsMetier || []).join('; '),
            a.entreprise,
            a.dateInscription
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `artisans-mecanique-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }, [filteredArtisans]);

    // Export PDF (filtered data)
    const handleExportPDF = useCallback(() => {
        generateListPDF(filteredArtisans, filters);
    }, [filteredArtisans, filters]);

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Left: Back link and Logo */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">Retour</span>
                            </Link>
                            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                            <div className="relative h-10 w-28 sm:h-12 sm:w-32">
                                <Image
                                    src="/images/logo-pmn.png"
                                    alt="Logo PMN"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            {/* Refresh button */}
                            <button
                                onClick={loadArtisans}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                title="Rafraîchir les données"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={handleExportCSV}
                                disabled={isLoading || filteredArtisans.length === 0}
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                title="Exporter en CSV"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Exporter CSV</span>
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={isLoading || filteredArtisans.length === 0}
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                title="Exporter en PDF"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">Exporter PDF</span>
                            </button>
                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block" />
                            {/* Logout button */}
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Page title */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                Administration – Mécanique
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Gestion des artisans des métiers mécaniques • Données en temps réel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                            <p className="text-xs text-red-600 mt-1">
                                Vérifiez votre connexion internet et réessayez.
                            </p>
                        </div>
                        <button
                            onClick={loadArtisans}
                            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Loading state */}
                {isLoading && artisans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                        <p className="text-gray-600">Chargement des artisans depuis Back4App...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats cards - Dynamic based on filtered data */}
                        <StatsCards
                            totalArtisans={stats.total}
                            topRegions={stats.byRegion}
                            topMetiers={stats.byMetier}
                            genreStats={stats.byGenre}
                        />

                        {/* Filters */}
                        <AdminFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            regions={regions}
                            departements={departements}
                            totalResults={filteredArtisans.length}
                        />

                        {/* Table */}
                        <AdminTable
                            artisans={paginatedArtisans}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        {/* Empty state */}
                        {!isLoading && filteredArtisans.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun artisan trouvé
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {artisans.length === 0
                                        ? "Aucun artisan n'est encore inscrit dans la base de données."
                                        : "Aucun artisan ne correspond aux filtres sélectionnés."}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredArtisans.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredArtisans.length}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-xs text-gray-500">
                        © 2025 Projet Mobilier National - Espace Administration • Connecté à Back4App
                    </p>
                </div>
            </footer>

            {/* Modals */}
            {selectedArtisan && (
                <ArtisanDetailModal
                    artisan={selectedArtisan}
                    onClose={() => setSelectedArtisan(null)}
                />
            )}

            {artisanToDelete && (
                <DeleteConfirmModal
                    artisan={artisanToDelete}
                    onClose={() => setArtisanToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}
