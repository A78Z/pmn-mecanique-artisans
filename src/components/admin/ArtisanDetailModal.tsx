"use client";

import { X, User, MapPin, Briefcase, Phone, Calendar, Building2, CreditCard, CheckCircle, XCircle, Download } from 'lucide-react';
import { Artisan } from '@/types/artisan';
import { jsPDF } from 'jspdf';

interface ArtisanDetailModalProps {
    artisan: Artisan;
    onClose: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2">
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    );
}

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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[metier] || 'bg-gray-100 text-gray-700'}`}>
            {metier}
        </span>
    );
}

/**
 * Generate PDF profile for an artisan
 * Format A4 with institutional styling
 */
function generateArtisanPDF(artisan: Artisan) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Colors - PMN palette
    const greenDark = [26, 90, 58] as const;
    const greenLight = [34, 139, 77] as const;
    const gray = [100, 100, 100] as const;
    const grayLight = [150, 150, 150] as const;
    const black = [30, 30, 30] as const;

    let y = 20; // Starting Y position

    // ══════════════════════════════════════════
    // HEADER - Institutional
    // ══════════════════════════════════════════

    // Green header bar
    doc.setFillColor(...greenDark);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJET MOBILIER NATIONAL', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('République du Sénégal - Ministère de la Culture, de l\'Artisanat et du Tourisme', 105, 23, { align: 'center' });

    // Document type
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHE ARTISAN', 105, 35, { align: 'center' });

    y = 50;

    // ══════════════════════════════════════════
    // ARTISAN IDENTITY
    // ══════════════════════════════════════════

    // ID Badge
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, y, 180, 25, 3, 3, 'F');

    doc.setTextColor(...greenDark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('IDENTIFIANT:', 20, y + 8);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'normal');
    doc.text(artisan.id, 50, y + 8);

    doc.setTextColor(...greenDark);
    doc.setFont('helvetica', 'bold');
    doc.text('NOM COMPLET:', 20, y + 16);
    doc.setTextColor(...black);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${artisan.prenom} ${artisan.nom}`, 55, y + 16);

    doc.setTextColor(...grayLight);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Genre: ${artisan.genre}`, 150, y + 16);

    y += 35;

    // ══════════════════════════════════════════
    // CORPS DE MÉTIER
    // ══════════════════════════════════════════

    doc.setTextColor(...greenDark);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CORPS DE MÉTIER', 15, y);

    doc.setDrawColor(...greenLight);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);

    y += 8;
    doc.setTextColor(...black);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(artisan.corpsMetier.join(' • '), 15, y);

    y += 15;

    // ══════════════════════════════════════════
    // INFORMATIONS PERSONNELLES
    // ══════════════════════════════════════════

    doc.setTextColor(...greenDark);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS PERSONNELLES', 15, y);

    doc.setDrawColor(...greenLight);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(9);

    const addInfoLine = (label: string, value: string, xOffset = 15) => {
        doc.setTextColor(...gray);
        doc.setFont('helvetica', 'normal');
        doc.text(label + ':', xOffset, y);
        doc.setTextColor(...black);
        doc.setFont('helvetica', 'bold');
        doc.text(value, xOffset + 35, y);
        y += 6;
    };

    addInfoLine('Téléphone', artisan.telephone);
    addInfoLine('CNI', artisan.cni);
    addInfoLine('Adresse', artisan.adresse);
    addInfoLine('Quartier', artisan.quartier);
    addInfoLine('Commune', artisan.commune);
    addInfoLine('Département', artisan.departement);
    addInfoLine('Région', artisan.region);

    y += 10;

    // ══════════════════════════════════════════
    // INFORMATIONS PROFESSIONNELLES
    // ══════════════════════════════════════════

    doc.setTextColor(...greenDark);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS PROFESSIONNELLES', 15, y);

    doc.setDrawColor(...greenLight);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(9);

    addInfoLine('Entreprise', artisan.entreprise);
    addInfoLine('NINEA', artisan.ninea);
    addInfoLine('Adresse Entr.', artisan.adresseEntreprise);
    addInfoLine('Employés', artisan.nbEmployes);
    addInfoLine('Expérience', `${artisan.experience} ans`);

    y += 10;

    // ══════════════════════════════════════════
    // HISTORIQUE FINANCIER
    // ══════════════════════════════════════════

    doc.setTextColor(...greenDark);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIQUE FINANCIER', 15, y);

    doc.setDrawColor(...greenLight);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(9);

    // Financement État
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text('Financement État:', 15, y);
    if (artisan.financementEtat) {
        doc.setTextColor(34, 139, 77);
        doc.setFont('helvetica', 'bold');
        doc.text(`Oui - ${artisan.financementEtatStructure} (${artisan.financementEtatAnnee})`, 50, y);
    } else {
        doc.setTextColor(...grayLight);
        doc.text('Non', 50, y);
    }

    y += 6;

    // Prêt bancaire
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text('Prêt bancaire:', 15, y);
    if (artisan.pretBanque) {
        doc.setTextColor(34, 139, 77);
        doc.setFont('helvetica', 'bold');
        doc.text(`Oui - ${artisan.pretBanqueInstitution} - ${artisan.pretBanqueObjet}`, 50, y);
    } else {
        doc.setTextColor(...grayLight);
        doc.text('Non', 50, y);
    }

    y += 15;

    // ══════════════════════════════════════════
    // DATE D'INSCRIPTION
    // ══════════════════════════════════════════

    doc.setFillColor(240, 245, 240);
    doc.roundedRect(15, y, 180, 12, 2, 2, 'F');

    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const dateStr = new Date(artisan.dateInscription).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    doc.text(`Date d'inscription: ${dateStr}`, 105, y + 7, { align: 'center' });

    // ══════════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════════

    const footerY = 280;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, footerY, 195, footerY);

    doc.setTextColor(...grayLight);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Document généré par le Projet Mobilier National', 105, footerY + 5, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} PMN - Tous droits réservés`, 105, footerY + 10, { align: 'center' });

    // Generate filename and save
    const filename = `profil-artisan-${artisan.id}.pdf`;
    doc.save(filename);
}

export function ArtisanDetailModal({ artisan, onClose }: ArtisanDetailModalProps) {
    const handleDownloadPDF = () => {
        generateArtisanPDF(artisan);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-green-200 text-xs font-mono">{artisan.id}</p>
                            <h2 className="text-xl font-bold mt-1">{artisan.prenom} {artisan.nom}</h2>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${artisan.genre === 'Homme' ? 'bg-blue-500/20 text-blue-100' : 'bg-pink-500/20 text-pink-100'
                                }`}>
                                {artisan.genre}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* PDF Download Button */}
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                                title="Télécharger le profil en PDF"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Corps de métier */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Corps de métier</p>
                        <div className="flex flex-wrap gap-2">
                            {artisan.corpsMetier.map((m, i) => (
                                <MetierBadge key={i} metier={m} />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                        {/* Informations personnelles */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                                Informations personnelles
                            </h3>
                            <InfoRow
                                icon={<Phone className="w-4 h-4" />}
                                label="Téléphone"
                                value={artisan.telephone}
                            />
                            <InfoRow
                                icon={<CreditCard className="w-4 h-4" />}
                                label="CNI"
                                value={artisan.cni}
                            />
                            <InfoRow
                                icon={<MapPin className="w-4 h-4" />}
                                label="Adresse"
                                value={artisan.adresse}
                            />
                            <InfoRow
                                icon={<MapPin className="w-4 h-4" />}
                                label="Localisation"
                                value={`${artisan.quartier}, ${artisan.commune}, ${artisan.departement}, ${artisan.region}`}
                            />
                        </div>

                        {/* Informations professionnelles */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                                Informations professionnelles
                            </h3>
                            <InfoRow
                                icon={<Building2 className="w-4 h-4" />}
                                label="Entreprise"
                                value={artisan.entreprise}
                            />
                            <InfoRow
                                icon={<CreditCard className="w-4 h-4" />}
                                label="NINEA"
                                value={artisan.ninea}
                            />
                            <InfoRow
                                icon={<User className="w-4 h-4" />}
                                label="Employés"
                                value={artisan.nbEmployes}
                            />
                            <InfoRow
                                icon={<Briefcase className="w-4 h-4" />}
                                label="Expérience"
                                value={`${artisan.experience} ans`}
                            />
                        </div>
                    </div>

                    {/* Financement */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Historique financier</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg ${artisan.financementEtat ? 'bg-green-50' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {artisan.financementEtat ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium">Financement État</span>
                                </div>
                                {artisan.financementEtat && (
                                    <p className="text-xs text-gray-600 ml-6">
                                        {artisan.financementEtatStructure} ({artisan.financementEtatAnnee})
                                    </p>
                                )}
                            </div>
                            <div className={`p-3 rounded-lg ${artisan.pretBanque ? 'bg-green-50' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {artisan.pretBanque ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium">Prêt bancaire</span>
                                </div>
                                {artisan.pretBanque && (
                                    <p className="text-xs text-gray-600 ml-6">
                                        {artisan.pretBanqueInstitution} - {artisan.pretBanqueObjet}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date inscription */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Inscrit le {new Date(artisan.dateInscription).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    {/* PDF Download Button (also in footer for better accessibility) */}
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Télécharger le profil (PDF)</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ArtisanDetailModal;
