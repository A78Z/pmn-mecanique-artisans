"use client";

import { Users, MapPin, Wrench, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    subtitle?: string;
    trend?: string;
    color: 'green' | 'blue' | 'yellow' | 'purple';
}

const colorStyles = {
    green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        icon: 'bg-gradient-to-br from-green-500 to-green-600',
        text: 'text-green-700',
        border: 'border-green-200'
    },
    blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
        text: 'text-blue-700',
        border: 'border-blue-200'
    },
    yellow: {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
        icon: 'bg-gradient-to-br from-amber-500 to-amber-600',
        text: 'text-amber-700',
        border: 'border-amber-200'
    },
    purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
        text: 'text-purple-700',
        border: 'border-purple-200'
    }
};

function StatCard({ title, value, icon, subtitle, trend, color }: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">{title}</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${styles.text}`}>{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
                <div className={`${styles.icon} p-2.5 sm:p-3 rounded-lg text-white shadow-sm`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
}

interface StatsCardsProps {
    totalArtisans: number;
    topRegions: { region: string; count: number }[];
    topMetiers: { metier: string; count: number }[];
    genreStats: { hommes: number; femmes: number };
}

export function StatsCards({ totalArtisans, topRegions, topMetiers, genreStats }: StatsCardsProps) {
    const topRegion = topRegions[0];
    const topMetier = topMetiers[0];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Total Artisans"
                value={totalArtisans}
                icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
                subtitle={`${genreStats.hommes} hommes, ${genreStats.femmes} femmes`}
                color="green"
            />
            <StatCard
                title="Région principale"
                value={topRegion?.region || '-'}
                icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}
                subtitle={`${topRegion?.count || 0} artisans`}
                color="blue"
            />
            <StatCard
                title="Métier principal"
                value={topMetier?.metier || '-'}
                icon={<Wrench className="w-5 h-5 sm:w-6 sm:h-6" />}
                subtitle={`${topMetier?.count || 0} artisans`}
                color="yellow"
            />
            <StatCard
                title="Inscriptions récentes"
                value="+12"
                icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                subtitle="Ce mois"
                trend="+15% vs dernier mois"
                color="purple"
            />
        </div>
    );
}

export default StatsCards;
