# Global Form

Projet React initialisé avec Vite, React Router, Tailwind CSS (v2.x) et Supabase.

## Technologies utilisées

- **Vite** - Build tool et serveur de développement
- **React** - Bibliothèque UI
- **React Router** - Routage côté client
- **Tailwind CSS v2.2.19** - Framework CSS utilitaire (version 2021)
- **Supabase** - Backend as a Service (BaaS)

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Configuration Supabase

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos clés Supabase :

```
VITE_SUPABASE_URL=votre-url-supabase
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

3. Importez le client Supabase dans vos composants :

```javascript
import { supabase } from './lib/supabase'
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```
# La_GlobeForm
