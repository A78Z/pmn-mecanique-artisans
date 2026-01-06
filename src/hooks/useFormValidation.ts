"use client";

import { useMemo, useCallback } from 'react';
import { LocationData } from '@/components/LocationSelector';

// Form data interface matching page.tsx
export interface FormData {
    prenom: string;
    nom: string;
    phone: string;
    genre: string;
    cni: string;
    validiteCni: string;
    carteArtisan: string;
    validiteCarteArtisan: string;
    location: LocationData;
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

// Error messages interface
export interface FormErrors {
    prenom?: string;
    nom?: string;
    phone?: string;
    genre?: string;
    cni?: string;
    validiteCni?: string;
    carteArtisan?: string;
    validiteCarteArtisan?: string;
    location?: Partial<Record<keyof LocationData, string>>;
    corpsMetier?: string;
    entreprise?: string;
    ninea?: string;
    adresseEntreprise?: string;
    nbEmployes?: string;
    experience?: string;
    financementEtatStructure?: string;
    financementEtatAnnee?: string;
    pretBanqueInstitution?: string;
    pretBanqueObjet?: string;
}

// Validation functions
const validators = {
    /**
     * Check if string is non-empty and has minimum length
     */
    isNonEmpty: (value: string, minLength = 1): boolean => {
        return value.trim().length >= minLength;
    },

    /**
     * Validate Senegalese phone number format
     * Valid formats: 77XXXXXXX, 78XXXXXXX, 76XXXXXXX, 70XXXXXXX, 75XXXXXXX
     * With or without spaces/dashes
     */
    isValidPhone: (phone: string): boolean => {
        // Remove spaces, dashes, and dots
        const cleaned = phone.replace(/[\s\-\.]/g, '');
        // Senegalese mobile: starts with 7, followed by 0/5/6/7/8, then 7 more digits
        const senegalPattern = /^7[05678]\d{7}$/;
        return senegalPattern.test(cleaned);
    },

    /**
     * Check if date string is a valid date
     */
    isValidDate: (dateStr: string): boolean => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    },

    /**
     * Check if year is valid (4 digits, reasonable range)
     */
    isValidYear: (yearStr: string): boolean => {
        const year = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        return !isNaN(year) && year >= 1950 && year <= currentYear;
    }
};

/**
 * Custom hook for form validation
 * Returns validation errors and form validity status
 */
export function useFormValidation(formData: FormData, hasAttemptedSubmit: boolean) {

    // Memoized validation logic
    const errors: FormErrors = useMemo(() => {
        const newErrors: FormErrors = {};

        // === Personal Information ===

        if (!validators.isNonEmpty(formData.prenom, 2)) {
            newErrors.prenom = 'Le prénom est requis (minimum 2 caractères)';
        }

        if (!validators.isNonEmpty(formData.nom, 2)) {
            newErrors.nom = 'Le nom est requis (minimum 2 caractères)';
        }

        if (!validators.isNonEmpty(formData.phone)) {
            newErrors.phone = 'Le numéro de téléphone est requis';
        } else if (!validators.isValidPhone(formData.phone)) {
            newErrors.phone = 'Numéro de téléphone invalide (format: 7X XXX XX XX)';
        }

        if (!formData.genre) {
            newErrors.genre = 'Veuillez sélectionner votre genre';
        }

        if (!validators.isNonEmpty(formData.cni)) {
            newErrors.cni = 'Le numéro CNI est requis';
        }

        if (!validators.isValidDate(formData.validiteCni)) {
            newErrors.validiteCni = 'La date de validité du CNI est requise';
        }

        if (!validators.isNonEmpty(formData.carteArtisan)) {
            newErrors.carteArtisan = 'Le numéro de carte professionnelle est requis';
        }

        if (!validators.isValidDate(formData.validiteCarteArtisan)) {
            newErrors.validiteCarteArtisan = 'La date de validité de la carte est requise';
        }

        // === Location ===
        const locationErrors: Partial<Record<keyof LocationData, string>> = {};

        if (!validators.isNonEmpty(formData.location.adresse)) {
            locationErrors.adresse = 'L\'adresse est requise';
        }
        if (!formData.location.region) {
            locationErrors.region = 'Veuillez sélectionner une région';
        }
        if (!formData.location.departement) {
            locationErrors.departement = 'Veuillez sélectionner un département';
        }
        if (!formData.location.commune) {
            locationErrors.commune = 'Veuillez sélectionner une commune';
        }
        if (!validators.isNonEmpty(formData.location.quartier)) {
            locationErrors.quartier = 'Le quartier/village est requis';
        }

        if (Object.keys(locationErrors).length > 0) {
            newErrors.location = locationErrors;
        }

        // === Professional Information ===

        if (formData.corpsMetier.length === 0) {
            newErrors.corpsMetier = 'Veuillez sélectionner au moins un corps de métier';
        }

        if (!validators.isNonEmpty(formData.entreprise)) {
            newErrors.entreprise = 'Le nom de l\'entreprise est requis';
        }

        if (!validators.isNonEmpty(formData.ninea)) {
            newErrors.ninea = 'Le NINEA est requis';
        }

        if (!validators.isNonEmpty(formData.adresseEntreprise)) {
            newErrors.adresseEntreprise = 'L\'adresse de l\'entreprise est requise';
        }

        if (!formData.nbEmployes) {
            newErrors.nbEmployes = 'Veuillez sélectionner le nombre d\'employés';
        }

        if (!formData.experience) {
            newErrors.experience = 'Veuillez sélectionner vos années d\'expérience';
        }

        // === Conditional Fields: Financement État ===
        if (formData.financementEtat === 'Oui') {
            if (!validators.isNonEmpty(formData.financementEtatStructure)) {
                newErrors.financementEtatStructure = 'Le nom de la structure est requis';
            }
            if (!validators.isNonEmpty(formData.financementEtatAnnee)) {
                newErrors.financementEtatAnnee = 'L\'année du financement est requise';
            } else if (!validators.isValidYear(formData.financementEtatAnnee)) {
                newErrors.financementEtatAnnee = 'Veuillez entrer une année valide';
            }
        }

        // === Conditional Fields: Prêt Banque ===
        if (formData.pretBanque === 'Oui') {
            if (!validators.isNonEmpty(formData.pretBanqueInstitution)) {
                newErrors.pretBanqueInstitution = 'Le nom de l\'institution est requis';
            }
            if (!validators.isNonEmpty(formData.pretBanqueObjet)) {
                newErrors.pretBanqueObjet = 'L\'objet du prêt est requis';
            }
        }

        return newErrors;
    }, [formData]);

    // Check if entire form is valid
    const isFormValid = useMemo(() => {
        return Object.keys(errors).length === 0;
    }, [errors]);

    // Get visible errors (only show if user has attempted submit)
    const visibleErrors = useMemo(() => {
        return hasAttemptedSubmit ? errors : {};
    }, [errors, hasAttemptedSubmit]);

    // Get first error field ID for scrolling
    const getFirstErrorFieldId = useCallback((): string | null => {
        const errorKeys = Object.keys(errors) as (keyof FormErrors)[];

        if (errorKeys.length === 0) return null;

        // Priority order for scrolling
        const fieldOrder: (keyof FormErrors)[] = [
            'prenom', 'nom', 'phone', 'genre', 'cni', 'validiteCni',
            'carteArtisan', 'validiteCarteArtisan', 'location',
            'corpsMetier', 'entreprise', 'ninea', 'adresseEntreprise',
            'nbEmployes', 'experience', 'financementEtatStructure',
            'financementEtatAnnee', 'pretBanqueInstitution', 'pretBanqueObjet'
        ];

        for (const field of fieldOrder) {
            if (errors[field]) {
                // Handle location sub-fields
                if (field === 'location' && errors.location) {
                    const locationFields: (keyof LocationData)[] = ['adresse', 'region', 'departement', 'commune', 'quartier'];
                    for (const locField of locationFields) {
                        if (errors.location[locField]) {
                            return locField;
                        }
                    }
                }
                return field;
            }
        }

        return null;
    }, [errors]);

    // Count total errors
    const errorCount = useMemo(() => {
        let count = Object.keys(errors).length;
        // Location counts as multiple errors but we just count as 1 for display
        if (errors.location) {
            count = count - 1 + Object.keys(errors.location).length;
        }
        return count;
    }, [errors]);

    return {
        errors,
        visibleErrors,
        isFormValid,
        getFirstErrorFieldId,
        errorCount
    };
}
