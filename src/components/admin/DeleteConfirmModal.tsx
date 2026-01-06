"use client";

import { AlertTriangle, X } from 'lucide-react';
import { Artisan } from '@/types/artisan';

interface DeleteConfirmModalProps {
    artisan: Artisan;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmModal({ artisan, onClose, onConfirm }: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    <p className="text-gray-600 mb-4">
                        Êtes-vous sûr de vouloir supprimer cet artisan ? Cette action est irréversible.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-gray-900">{artisan.prenom} {artisan.nom}</p>
                        <p className="text-sm text-gray-500 mt-1">{artisan.id}</p>
                        <p className="text-sm text-gray-500">{artisan.region} - {artisan.entreprise}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
