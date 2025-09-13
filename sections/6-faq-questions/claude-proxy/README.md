# Proxy Claude AI avec horaires

Serveur proxy pour l'API Claude avec gestion des horaires d'ouverture (7h-23h).

## Fonctionnalités

- ✅ Proxy CORS pour API Claude
- ✅ Horaires d'ouverture 7h-23h
- ✅ Message personnalisé hors horaires
- ✅ Monitoring via /health
- ✅ Gestion d'erreurs complète

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

## Variables d'environnement

- `PORT` : Port du serveur (défaut: 3001)

## Routes

- `POST /api/claude` : Proxy vers API Claude
- `GET /health` : Status serveur et horaires

## Horaires

- Ouvert : 7h-23h30
- ~489h/mois (dans limite Railway gratuit 500/mois max)
