"use client";

import { Search, Filter, X } from 'lucide-react';
import { CORPS_METIERS } from '@/data/mockArtisans';

interface FilterState {
    search: string;
    region: string;
    departement: string;
    corpsMetier: string;
    genre: string;
}

interface AdminFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    regions: string[];
    departements: string[];
    totalResults: number;
}

export function AdminFilters({ filters, onFilterChange, regions, departements, totalResults }: AdminFiltersProps) {
    const handleChange = (field: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [field]: value };

        // Reset département if region changes
        if (field === 'region' && value !== filters.region) {
            newFilters.departement = '';
        }

        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            region: '',
            departement: '',
            corpsMetier: '',
            genre: ''
        });
    };

    const hasActiveFilters = filters.search || filters.region || filters.departement || filters.corpsMetier || filters.genre;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm mb-6">
            {/* Search and Results count */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou téléphone..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Filter className="w-4 h-4" />
                    <span><strong>{totalResults}</strong> résultat{totalResults > 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Région */}
                <select
                    value={filters.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                    <option value="">Toutes les régions</option>
                    {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>

                {/* Département */}
                <select
                    value={filters.departement}
                    onChange={(e) => handleChange('departement', e.target.value)}
                    disabled={!filters.region}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">Tous les départements</option>
                    {departements.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                {/* Corps de métier */}
                <select
                    value={filters.corpsMetier}
                    onChange={(e) => handleChange('corpsMetier', e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                    <option value="">Tous les métiers</option>
                    {CORPS_METIERS.map(metier => (
                        <option key={metier} value={metier}>{metier}</option>
                    ))}
                </select>

                {/* Genre */}
                <select
                    value={filters.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                    <option value="">Tous les genres</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                </select>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="mt-3 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                    <span>Effacer les filtres</span>
                </button>
            )}
        </div>
    );
}

export default AdminFilters;
