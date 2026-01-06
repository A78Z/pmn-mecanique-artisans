"use client";

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Artisan } from '@/types/artisan';

interface AdminTableProps {
    artisans: Artisan[];
    onView: (artisan: Artisan) => void;
    onEdit: (artisan: Artisan) => void;
    onDelete: (artisan: Artisan) => void;
}

// Badge component for genre
function GenreBadge({ genre }: { genre: string }) {
    const isHomme = genre === 'Homme';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isHomme
            ? 'bg-blue-100 text-blue-700'
            : 'bg-pink-100 text-pink-700'
            }`}>
            {genre}
        </span>
    );
}

// Badge component for métier
function MetierBadge({ metier }: { metier: string }) {
    const colors: Record<string, string> = {
        'Vulgarisateur': 'bg-purple-100 text-purple-700',
        'Mécanicien auto': 'bg-green-100 text-green-700',
        'Électricien auto': 'bg-yellow-100 text-yellow-700',
        'Tôlier': 'bg-orange-100 text-orange-700',
        'Peinture auto': 'bg-red-100 text-red-700',
        'Technicien froid auto': 'bg-cyan-100 text-cyan-700'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[metier] || 'bg-gray-100 text-gray-700'}`}>
            {metier}
        </span>
    );
}

// Format date to French locale
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

export function AdminTable({ artisans, onView, onEdit, onDelete }: AdminTableProps) {
    if (artisans.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <p className="text-gray-500">Aucun artisan trouvé avec les filtres actuels.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Desktop table view */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom complet</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Genre</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Région</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Département</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Corps de métier</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entreprise</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Inscription</th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {artisans.map((artisan, index) => (
                            <tr
                                key={artisan.id}
                                className={`hover:bg-green-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                            >
                                <td className="px-4 py-3 text-sm font-mono text-gray-500">{artisan.id}</td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{artisan.prenom} {artisan.nom}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <GenreBadge genre={artisan.genre} />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{artisan.region}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{artisan.departement}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {artisan.corpsMetier.slice(0, 2).map((m, i) => (
                                            <MetierBadge key={i} metier={m} />
                                        ))}
                                        {artisan.corpsMetier.length > 2 && (
                                            <span className="text-xs text-gray-500">+{artisan.corpsMetier.length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 max-w-[150px] truncate" title={artisan.entreprise}>
                                    {artisan.entreprise}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{artisan.telephone}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(artisan.dateInscription)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => onView(artisan)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Voir le profil"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(artisan)}
                                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(artisan)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tablet view - horizontal scroll */}
            <div className="hidden sm:block lg:hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Région</th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Métier</th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Téléphone</th>
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {artisans.map((artisan, index) => (
                            <tr
                                key={artisan.id}
                                className={`hover:bg-green-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                            >
                                <td className="px-3 py-2.5 text-xs font-mono text-gray-500">{artisan.id}</td>
                                <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{artisan.prenom} {artisan.nom}</td>
                                <td className="px-3 py-2.5 text-sm text-gray-600">{artisan.region}</td>
                                <td className="px-3 py-2.5">
                                    <MetierBadge metier={artisan.corpsMetier[0]} />
                                </td>
                                <td className="px-3 py-2.5 text-xs font-mono text-gray-600">{artisan.telephone}</td>
                                <td className="px-3 py-2.5">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => onView(artisan)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDelete(artisan)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-gray-100">
                {artisans.map((artisan) => (
                    <div key={artisan.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-900">{artisan.prenom} {artisan.nom}</p>
                                <p className="text-xs text-gray-500 font-mono">{artisan.id}</p>
                            </div>
                            <GenreBadge genre={artisan.genre} />
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                            <p><span className="font-medium">Région:</span> {artisan.region}</p>
                            <p><span className="font-medium">Tél:</span> {artisan.telephone}</p>
                            <p><span className="font-medium">Entreprise:</span> {artisan.entreprise}</p>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {artisan.corpsMetier.map((m, i) => (
                                <MetierBadge key={i} metier={m} />
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => onView(artisan)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Voir</span>
                            </button>
                            <button
                                onClick={() => onEdit(artisan)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Modifier</span>
                            </button>
                            <button
                                onClick={() => onDelete(artisan)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminTable;
