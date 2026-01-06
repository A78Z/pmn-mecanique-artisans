"use client";

import Image from 'next/image';

/**
 * InstitutionalHeader - En-tête officiel pour les formulaires ministériels
 * 
 * Design institutionnel responsive avec mobile-first approach:
 * - Logos adaptifs selon la taille d'écran
 * - Espacements optimisés pour chaque viewport
 * - Textes lisibles sur tous les appareils
 */

export function InstitutionalHeader() {
    return (
        <header className="institutional-header">

            {/* ═══════════════════════════════════════════════════════════════
          BLOC 1: RÉPUBLIQUE DU SÉNÉGAL
          ═══════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col items-center">
                {/* Drapeau du Sénégal - Responsive sizing */}
                <div
                    className="relative overflow-hidden rounded-sm shadow-sm border border-gray-200 w-[70px] h-[47px] sm:w-[85px] sm:h-[57px] md:w-[100px] md:h-[67px]"
                >
                    <Image
                        src="/images/flag-senegal.png"
                        alt="Drapeau de la République du Sénégal"
                        fill
                        sizes="(max-width: 640px) 70px, (max-width: 768px) 85px, 100px"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>

                {/* Texte officiel - Responsive typography */}
                <div className="mt-3 sm:mt-4 text-center">
                    <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wider sm:tracking-widest text-gray-900 uppercase">
                        République du Sénégal
                    </h1>
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 italic mt-0.5 sm:mt-1 tracking-wide">
                        Un Peuple – Un But – Une Foi
                    </p>
                </div>
            </div>

            {/* Séparateur décoratif - Responsive width */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 my-4 sm:my-5 md:my-6">
                <div className="w-8 sm:w-10 md:w-12 h-px bg-gray-300" />
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-600" />
                <div className="w-8 sm:w-10 md:w-12 h-px bg-gray-300" />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
          BLOC 2: MINISTÈRE
          ═══════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col items-center w-full px-2 sm:px-0">
                {/* Logo MCAT - Responsive sizing */}
                <div className="relative h-[60px] sm:h-[70px] md:h-[80px] w-auto">
                    <Image
                        src="/images/logo-mcat.png"
                        alt="Logo du Ministère de la Culture, de l'Artisanat et du Tourisme"
                        width={300}
                        height={80}
                        sizes="(max-width: 480px) 200px, (max-width: 640px) 260px, 300px"
                        style={{
                            objectFit: 'contain',
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                        }}
                        priority
                    />
                </div>
            </div>

            {/* Séparateur décoratif - Responsive width */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 my-4 sm:my-5 md:my-6">
                <div className="w-6 sm:w-7 md:w-8 h-px bg-gray-200" />
                <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-yellow-500" />
                <div className="w-6 sm:w-7 md:w-8 h-px bg-gray-200" />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
          BLOC 3: PROJET DU MOBILIER NATIONAL
          ═══════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col items-center">
                {/* Logo PMN - Responsive sizing */}
                <div className="relative h-[70px] sm:h-[80px] md:h-[90px] w-auto">
                    <Image
                        src="/images/logo-pmn.png"
                        alt="Logo du Projet Mobilier National (PMN)"
                        width={180}
                        height={90}
                        sizes="(max-width: 480px) 120px, (max-width: 640px) 150px, 180px"
                        style={{
                            objectFit: 'contain',
                            height: '100%',
                            width: 'auto',
                        }}
                        priority
                    />
                </div>
            </div>

        </header>
    );
}

export default InstitutionalHeader;
