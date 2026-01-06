"use client";

import React, { useState, useRef, useCallback } from 'react';
import { User, Phone, CreditCard, Calendar, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { LocationSelector, LocationData } from '@/components/LocationSelector';
import { InstitutionalHeader } from '@/components/InstitutionalHeader';
import { useFormValidation, FormData } from '@/hooks/useFormValidation';
import { createArtisan } from '@/actions/artisanActions';

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    phone: '',
    genre: '',
    cni: '',
    validiteCni: '',
    carteArtisan: '',
    validiteCarteArtisan: '',
    location: {
      region: '',
      departement: '',
      commune: '',
      quartier: '',
      adresse: ''
    } as LocationData,
    corpsMetier: [] as string[],
    entreprise: '',
    ninea: '',
    adresseEntreprise: '',
    nbEmployes: '',
    experience: '',
    financementEtat: 'Non',
    financementEtatStructure: '',
    financementEtatAnnee: '',
    pretBanque: 'Non',
    pretBanqueInstitution: '',
    pretBanqueObjet: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Use validation hook
  const { visibleErrors, isFormValid, getFirstErrorFieldId, errorCount } = useFormValidation(formData, hasAttemptedSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLocationChange = (newLocation: LocationData) => {
    setFormData(prev => ({ ...prev, location: newLocation }));
  };

  const handleCheckboxChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, corpsMetier: values }));
  };

  // Scroll to first error field
  const scrollToFirstError = useCallback(() => {
    const firstErrorId = getFirstErrorFieldId();
    if (firstErrorId) {
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [getFirstErrorFieldId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);
    setSubmitError(null);

    // If form is invalid, scroll to first error
    if (!isFormValid) {
      // Small delay to allow errors to render
      setTimeout(scrollToFirstError, 100);
      return;
    }

    // Form is valid - submit to Back4App
    setIsSubmitting(true);

    try {
      const result = await createArtisan({
        prenom: formData.prenom,
        nom: formData.nom,
        genre: formData.genre,
        telephone: formData.phone,
        cni: formData.cni,
        validiteCni: formData.validiteCni,
        carteArtisan: formData.carteArtisan,
        validiteCarteArtisan: formData.validiteCarteArtisan,
        adresse: formData.location.adresse,
        region: formData.location.region,
        departement: formData.location.departement,
        commune: formData.location.commune,
        quartier: formData.location.quartier,
        corpsMetier: formData.corpsMetier,
        entreprise: formData.entreprise,
        ninea: formData.ninea,
        adresseEntreprise: formData.adresseEntreprise,
        nbEmployes: formData.nbEmployes,
        experience: formData.experience,
        financementEtat: formData.financementEtat,
        financementEtatStructure: formData.financementEtatStructure,
        financementEtatAnnee: formData.financementEtatAnnee,
        pretBanque: formData.pretBanque,
        pretBanqueInstitution: formData.pretBanqueInstitution,
        pretBanqueObjet: formData.pretBanqueObjet,
      });

      if (result.success) {
        console.log('Artisan created with ID:', result.id);
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 md:py-12 px-2 sm:px-4 md:px-6 lg:px-8 flex justify-center">
      {/* Carte principale premium - Responsive max-width */}
      <div className="premium-card max-w-4xl w-full space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-6 md:p-8 lg:p-10">

        {/* En-tête institutionnel officiel */}
        <InstitutionalHeader />

        {/* Titre du formulaire - Responsive spacing */}
        <div className="text-center space-y-2 sm:space-y-3 py-3 sm:py-4 px-2 sm:px-0">
          <h1 className="form-title">
            FICHE DE FORMATION : <br className="sm:hidden" />
            <span className="form-title-highlight">MAÎTRISE DES PROCÉDURES DE PASSATION DES MARCHÉS PUBLICS</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Bienvenue sur le portail d'inscription du Projet Mobilier National.
          </p>
        </div>

        {!isSubmitted && (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8" noValidate>

            {/* Error Banner - shown when form has errors after submit attempt */}
            {hasAttemptedSubmit && !isFormValid && (
              <div className="error-banner" role="alert" aria-live="polite">
                <AlertCircle className="error-banner-icon" />
                <div className="error-banner-content">
                  <p className="error-banner-title">Veuillez compléter le formulaire</p>
                  <p className="error-banner-message">
                    {errorCount === 1
                      ? 'Un champ obligatoire n\'est pas rempli correctement.'
                      : `${errorCount} champs obligatoires ne sont pas remplis correctement.`}
                  </p>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
              SECTION: Informations personnelles
              ═══════════════════════════════════════════════════════════ */}
            <div className="form-section space-y-4 sm:space-y-5 md:space-y-6">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="form-section-title">Informations personnelles</h3>
              </div>

              {/* Grid: 1 col mobile → 2 cols tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <Input
                  id="prenom"
                  label="Prénom"
                  placeholder="Prénom"
                  required
                  icon={<User className="w-4 h-4" />}
                  value={formData.prenom}
                  onChange={handleChange}
                  error={visibleErrors.prenom}
                />
                <Input
                  id="nom"
                  label="Nom"
                  placeholder="Nom"
                  required
                  icon={<User className="w-4 h-4" />}
                  value={formData.nom}
                  onChange={handleChange}
                  error={visibleErrors.nom}
                />
                <Input
                  id="phone"
                  label="Téléphone"
                  placeholder="77 123 45 67"
                  required
                  type="tel"
                  icon={<Phone className="w-4 h-4" />}
                  value={formData.phone}
                  onChange={handleChange}
                  error={visibleErrors.phone}
                />
                <Select
                  id="genre"
                  label="Genre"
                  options={['Homme', 'Femme']}
                  placeholder="Sélectionner"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  error={visibleErrors.genre}
                />
                <Input
                  id="cni"
                  label="CNI"
                  placeholder="CNI"
                  required
                  icon={<CreditCard className="w-4 h-4" />}
                  value={formData.cni}
                  onChange={handleChange}
                  error={visibleErrors.cni}
                />
                <Input
                  id="validiteCni"
                  label="Validité du CNI"
                  placeholder="jj/mm/aaaa"
                  required
                  type="date"
                  icon={<Calendar className="w-4 h-4" />}
                  value={formData.validiteCni}
                  onChange={handleChange}
                  error={visibleErrors.validiteCni}
                />
                <Input
                  id="carteArtisan"
                  label="Carte professionnelle d'artisan"
                  placeholder="Carte professionnelle"
                  required
                  icon={<CreditCard className="w-4 h-4" />}
                  value={formData.carteArtisan}
                  onChange={handleChange}
                  error={visibleErrors.carteArtisan}
                />
                <Input
                  id="validiteCarteArtisan"
                  label="Validité de la carte professionnelle"
                  placeholder="jj/mm/aaaa"
                  required
                  type="date"
                  icon={<Calendar className="w-4 h-4" />}
                  value={formData.validiteCarteArtisan}
                  onChange={handleChange}
                  error={visibleErrors.validiteCarteArtisan}
                />
              </div>

              {/* Sélecteur de localisation */}
              <LocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                errors={visibleErrors.location}
              />
            </div>

            {/* ═══════════════════════════════════════════════════════════
              SECTION: Informations professionnelles
              ═══════════════════════════════════════════════════════════ */}
            <div className="form-section space-y-4 sm:space-y-5 md:space-y-6">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="form-section-title">Informations professionnelles</h3>
              </div>

              {/* Corps de métiers */}
              <div className="premium-subsection">
                <CheckboxGroup
                  label="Corps de métiers"
                  required
                  options={[
                    'Vulgarisateur',
                    'Mécanicien auto',
                    'Électricien auto',
                    'Tôlier',
                    'Peinture auto',
                    'Technicien froid auto'
                  ]}
                  values={formData.corpsMetier}
                  onChange={handleCheckboxChange}
                  error={visibleErrors.corpsMetier}
                />
              </div>

              {/* Grid: 1 col mobile → 2 cols tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <Input
                  id="entreprise"
                  label="Entreprise"
                  placeholder="Votre entreprise"
                  required
                  value={formData.entreprise}
                  onChange={handleChange}
                  error={visibleErrors.entreprise}
                />
                <Input
                  id="ninea"
                  label="NINEA"
                  placeholder="NINEA"
                  required
                  value={formData.ninea}
                  onChange={handleChange}
                  error={visibleErrors.ninea}
                />
              </div>

              {/* Full width field */}
              <Input
                id="adresseEntreprise"
                label="Adresse de l'entreprise"
                placeholder="Adresse de l'entreprise"
                required
                value={formData.adresseEntreprise}
                onChange={handleChange}
                error={visibleErrors.adresseEntreprise}
              />

              {/* Grid: 1 col mobile → 2 cols tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <Select
                  id="nbEmployes"
                  label="Nombre d'employés"
                  placeholder="Sélectionner"
                  required
                  options={['1-5', '6-10', '11-20', '21-50', '+50']}
                  value={formData.nbEmployes}
                  onChange={handleChange}
                  error={visibleErrors.nbEmployes}
                />
                <Select
                  id="experience"
                  label="Années d'expérience"
                  placeholder="Sélectionner"
                  required
                  options={['0-2', '3-5', '6-10', '11-15', '16-20', '+20']}
                  value={formData.experience}
                  onChange={handleChange}
                  error={visibleErrors.experience}
                />
              </div>

              {/* Question: Financement État */}
              <div className="premium-subsection space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                  Avez-vous bénéficié d'un financement provenant d'une structure de l'État au cours des cinq (5) dernières années ? <span className="text-red-500">*</span>
                </p>
                <RadioGroup
                  name="financementEtat"
                  label=""
                  options={[{ label: 'Oui', value: 'Oui' }, { label: 'Non', value: 'Non' }]}
                  value={formData.financementEtat}
                  onChange={(val) => setFormData(prev => ({ ...prev, financementEtat: val }))}
                  horizontal
                  required
                />
                {formData.financementEtat === 'Oui' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                    <Input
                      id="financementEtatStructure"
                      label="Nom de la structure"
                      placeholder="Nom de la structure"
                      required
                      value={formData.financementEtatStructure}
                      onChange={handleChange}
                      error={visibleErrors.financementEtatStructure}
                    />
                    <Input
                      id="financementEtatAnnee"
                      label="Année du financement"
                      placeholder="Année (ex: 2023)"
                      required
                      type="number"
                      value={formData.financementEtatAnnee}
                      onChange={handleChange}
                      error={visibleErrors.financementEtatAnnee}
                    />
                  </div>
                )}
              </div>

              {/* Question: Prêt Banque/Microfinance */}
              <div className="premium-subsection space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed">
                  Avez-vous déjà bénéficié d'un prêt auprès d'une banque ou d'une institution de microfinance au cours des cinq (5) dernières années ? <span className="text-red-500">*</span>
                </p>
                <RadioGroup
                  name="pretBanque"
                  label=""
                  options={[{ label: 'Oui', value: 'Oui' }, { label: 'Non', value: 'Non' }]}
                  value={formData.pretBanque}
                  onChange={(val) => setFormData(prev => ({ ...prev, pretBanque: val }))}
                  horizontal
                  required
                />
                {formData.pretBanque === 'Oui' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                    <Input
                      id="pretBanqueInstitution"
                      label="Nom de l'institution"
                      placeholder="Nom de l'institution"
                      required
                      value={formData.pretBanqueInstitution}
                      onChange={handleChange}
                      error={visibleErrors.pretBanqueInstitution}
                    />
                    <Input
                      id="pretBanqueObjet"
                      label="Objet du prêt"
                      placeholder="Objet du prêt"
                      required
                      value={formData.pretBanqueObjet}
                      onChange={handleChange}
                      error={visibleErrors.pretBanqueObjet}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de soumission - Full width mobile, centered tablet+ */}
            <div className="flex flex-col items-center gap-3 pt-2 sm:pt-4">
              {/* Submit error message */}
              {submitError && (
                <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {submitError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="premium-button flex items-center justify-center gap-2"
                disabled={(hasAttemptedSubmit && !isFormValid) || isSubmitting}
                aria-disabled={(hasAttemptedSubmit && !isFormValid) || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Soumettre l'inscription</span>
                )}
              </button>

              {/* Helper text when form is invalid */}
              {hasAttemptedSubmit && !isFormValid && !isSubmitting && (
                <p className="text-sm text-gray-500 text-center">
                  Veuillez remplir tous les champs obligatoires avant de soumettre.
                </p>
              )}
            </div>
          </form>
        )}

        {/* Message de confirmation après soumission */}
        {isSubmitted && (
          <div className="text-center py-12 sm:py-16 space-y-6">
            {/* Icône de succès */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Message de confirmation */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Inscription soumise avec succès
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto px-4">
                Votre inscription a été soumise avec succès.
                <br />
                Elle sera examinée par les services compétents du Projet du Mobilier National.
              </p>
            </div>

            {/* Bouton pour soumettre une autre inscription */}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setHasAttemptedSubmit(false);
                setFormData({
                  prenom: '',
                  nom: '',
                  phone: '',
                  genre: '',
                  cni: '',
                  validiteCni: '',
                  carteArtisan: '',
                  validiteCarteArtisan: '',
                  location: {
                    region: '',
                    departement: '',
                    commune: '',
                    quartier: '',
                    adresse: ''
                  },
                  corpsMetier: [],
                  entreprise: '',
                  ninea: '',
                  adresseEntreprise: '',
                  nbEmployes: '',
                  experience: '',
                  financementEtat: 'Non',
                  financementEtatStructure: '',
                  financementEtatAnnee: '',
                  pretBanque: 'Non',
                  pretBanqueInstitution: '',
                  pretBanqueObjet: '',
                });
              }}
              className="mt-4 px-6 py-2.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              Soumettre une autre inscription
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="premium-footer">
          <p>© 2025 Projet Mobilier National - Tous droits réservés</p>
        </div>

      </div>
    </div>
  );
}
