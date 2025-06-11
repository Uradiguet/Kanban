// kanban-front/next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Kanban'; // Remplacez par le nom exact de votre repository

const nextConfig: NextConfig = {
    // Configuration pour l'export statique
    output: 'export',

    // Ajouter un slash à la fin des URLs
    trailingSlash: true,

    // Désactiver l'optimisation d'images pour GitHub Pages
    images: {
        unoptimized: true,
    },

    // Configuration pour GitHub Pages - projet dans un sous-dossier
    basePath: isProd ? `/${repoName}` : '',
    assetPrefix: isProd ? `/${repoName}/` : '',

    // Configuration pour éviter les erreurs de build
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;