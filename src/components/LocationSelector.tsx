"use client";

import React, { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { MapPin, Loader2 } from 'lucide-react';
import { getRegions, getDepartements, getCommunes } from '@/data/locations';

export interface LocationData {
    region: string;
    departement: string;
    commune: string;
    quartier: string;
    adresse: string;
}

interface LocationSelectorProps {
    value: LocationData;
    onChange: (value: LocationData) => void;
    errors?: Partial<Record<keyof LocationData, string>>;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange, errors }) => {
    const [regions, setRegions] = useState<string[]>([]);
    const [departements, setDepartements] = useState<string[]>([]);
    const [communes, setCommunes] = useState<string[]>([]);

    const [loadingRegion, setLoadingRegion] = useState(false);
    const [loadingDept, setLoadingDept] = useState(false);
    const [loadingCommune, setLoadingCommune] = useState(false);

    // Load regions on mount
    useEffect(() => {
        setLoadingRegion(true);
        // Simulate slight delay for "app-like" feel
        setTimeout(() => {
            setRegions(getRegions());
            setLoadingRegion(false);
        }, 400);
    }, []);

    // Update departements when region changes
    useEffect(() => {
        if (value.region) {
            setLoadingDept(true);
            setTimeout(() => {
                setDepartements(getDepartements(value.region));
                setLoadingDept(false);
            }, 300);
        } else {
            setDepartements([]);
        }
    }, [value.region]);

    // Update communes when departement changes
    useEffect(() => {
        if (value.region && value.departement) {
            setLoadingCommune(true);
            setTimeout(() => {
                setCommunes(getCommunes(value.region, value.departement));
                setLoadingCommune(false);
            }, 300);
        } else {
            setCommunes([]);
        }
    }, [value.region, value.departement]);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRegion = e.target.value;
        onChange({
            ...value,
            region: newRegion,
            departement: '',
            commune: ''
        });
    };

    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDepartement = e.target.value;
        onChange({ ...value, departement: newDepartement, commune: '' });
    };

    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...value, commune: e.target.value });
    };

    const handleQuartierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, quartier: e.target.value });
    };

    const handleAdresseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, adresse: e.target.value });
    };

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6 pt-2">
            {/* Adresse - Full width */}
            <Input
                id="adresse"
                label="Adresse"
                placeholder="Votre adresse complète"
                required
                icon={<MapPin className="w-4 h-4" />}
                value={value.adresse}
                onChange={handleAdresseChange}
                error={errors?.adresse}
            />

            {/* Location grid: 1 col mobile → 2 cols tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 relative">
                <div className="relative">
                    <Select
                        id="region"
                        label="Région"
                        placeholder={loadingRegion ? "Chargement..." : "Sélectionner une région"}
                        required
                        options={regions}
                        value={value.region}
                        onChange={handleRegionChange}
                        error={errors?.region}
                        disabled={loadingRegion}
                    />
                    {loadingRegion && <Loader2 className="absolute right-8 top-[38px] w-4 h-4 animate-spin text-green-600" />}
                </div>

                <div className="relative">
                    <Select
                        id="departement"
                        label="Département"
                        placeholder={loadingDept ? "Chargement..." : (!value.region ? "Sélectionnez d'abord une région" : "Sélectionner un département")}
                        required
                        options={departements}
                        value={value.departement}
                        onChange={handleDepartementChange}
                        error={errors?.departement}
                        disabled={!value.region || loadingDept}
                    />
                    {loadingDept && <Loader2 className="absolute right-8 top-[38px] w-4 h-4 animate-spin text-green-600" />}
                </div>

                <div className="relative">
                    <Select
                        id="commune"
                        label="Commune"
                        placeholder={loadingCommune ? "Chargement..." : (!value.departement ? "Sélectionnez d'abord un département" : "Sélectionner une commune")}
                        required
                        options={communes}
                        value={value.commune}
                        onChange={handleCommuneChange}
                        error={errors?.commune}
                        disabled={!value.departement || loadingCommune}
                    />
                    {loadingCommune && <Loader2 className="absolute right-8 top-[38px] w-4 h-4 animate-spin text-green-600" />}
                </div>

                <Input
                    id="quartier"
                    label="Village/Quartier"
                    placeholder="Saisissez votre village ou quartier"
                    required
                    icon={<MapPin className="w-4 h-4" />}
                    value={value.quartier}
                    onChange={handleQuartierChange}
                    error={errors?.quartier}
                />
            </div>
        </div>
    );
};
