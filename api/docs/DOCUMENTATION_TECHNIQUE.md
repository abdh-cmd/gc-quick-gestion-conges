# Documentation technique — API Tempolis

## Objet et périmètre

Ce dépôt contient le socle backend de Tempolis. À la version `0.0.1`, il s'agit d'une application NestJS minimale, dont l'unique comportement exposé est `GET /` → `Hello World!`.

Les entités de domaine issues du MCD sont présentes, mais aucun contrôleur CRUD ni connexion à une base de données n'est encore configuré. Cette documentation décrit l'implémentation existante, sans anticiper de contrat non développé.

## Stack technique

| Composant | Technologie |
| --- | --- |
| Runtime | Node.js |
| Langage | TypeScript (cible ES2023) |
| Framework HTTP | NestJS 11 avec adaptateur Express |
| Tests | Jest, Supertest et `@nestjs/testing` |
| Lint / formatage | ESLint et Prettier |
| Mapping objet-relationnel | TypeORM |

## Modèle de données

Les entités TypeORM sont dans `src/entities/`. Elles correspondent au MCD :

```text
Structure 1 --- 0..n Utilisateur 1 --- 0..n Demande 0..n --- 1 TypeDemande
```

| Entité | Table | Relations |
| --- | --- | --- |
| `Structure` | `structures` | Une structure a zéro à plusieurs utilisateurs. |
| `Utilisateur` | `utilisateurs` | Un utilisateur appartient à une structure et possède zéro à plusieurs demandes. |
| `Demande` | `demandes` | Une demande appartient à un utilisateur et à un type de demande. |
| `TypeDemande` | `types_demande` | Un type caractérise zéro à plusieurs demandes. |

Les clés étrangères prévues sont `utilisateurs.structure_id`, `demandes.utilisateur_id` et `demandes.type_demande_id`. Les identifiants sont des chaînes de 50 caractères comme indiqué dans le MCD. `motDePasseHash` est stocké dans la colonne `mdp`, exclue des sélections par défaut ; elle doit recevoir un hash, jamais un mot de passe en clair.

## Architecture

```text
Client HTTP
  -> AppController (GET /)
    -> AppService (getHello)
      -> "Hello World!"
```

- `src/main.ts` démarre NestJS et écoute sur `PORT`, ou `3000` si cette variable est absente.
- `src/app.module.ts` est le module racine ; il déclare le contrôleur et le service.
- `src/app.controller.ts` porte l'endpoint HTTP `GET /`.
- `src/app.service.ts` contient la réponse applicative actuellement renvoyée.
- `src/entities/` contient le modèle de données TypeORM.
- `test/app.e2e-spec.ts` vérifie la réponse de bout en bout.

## Démarrage local

Prérequis : une version récente de Node.js compatible avec NestJS 11 et npm.

```bash
npm install
npm run start:dev
```

L'API est ensuite disponible sur `http://localhost:3000`. Pour choisir un autre port sous PowerShell :

```powershell
$env:PORT=3001
npm run start:dev
```

## Base de données

Une base MariaDB/MySQL `tempolis` a été créée en local pour XAMPP. La connexion par défaut est `127.0.0.1:3306`, avec l'utilisateur `root` et sans mot de passe. Les paramètres peuvent être fournis via les variables `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` et `DB_SYNCHRONIZE` ; voir [.env.example](../.env.example).

Au démarrage, TypeORM crée ou met à jour automatiquement les tables suivantes depuis les entités :

- `structures`
- `utilisateurs`
- `types_demande`
- `demandes`

Ce mécanisme est actif par défaut en développement. Il ne doit pas être utilisé en production : définissez `DB_SYNCHRONIZE=false` et gérez les évolutions du schéma avec des migrations.

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run start` | Démarre l'application. |
| `npm run start:dev` | Démarre l'application avec rechargement à chaud. |
| `npm run build` | Compile TypeScript dans `dist/`. |
| `npm run start:prod` | Exécute la version compilée. |
| `npm run test` | Exécute les tests unitaires. |
| `npm run test:e2e` | Exécute le test HTTP de bout en bout. |
| `npm run lint` | Lance ESLint avec correction automatique. |
| `npm run format` | Formate les sources et les tests avec Prettier. |

## Contrat API

La description lisible de la route est dans [SPECIFICATION_API.md](SPECIFICATION_API.md). La spécification machine est disponible dans [openapi.yaml](openapi.yaml) au format OpenAPI 3.0.3, prête à être importée dans Swagger UI, Postman ou Insomnia.

## Tests et vérification

Le test e2e crée une instance NestJS, appelle `GET /` et attend :

- le statut HTTP `200` ;
- le corps exact `Hello World!`.

Exécuter la vérification :

```bash
npm run test:e2e
npm run build
```

## Authentification

L'authentification est implémentée dans `src/auth/` avec JWT et Passport. Elle vérifie l'e-mail et le hash bcrypt de `utilisateurs.mdp`.

- `POST /auth/register` crée un utilisateur dans une structure existante et retourne un JWT.
- `POST /auth/login` vérifie les identifiants et retourne un JWT d'une heure par défaut.
- `GET /auth/profile` exige `Authorization: Bearer <accessToken>`.

La clé JWT est lue depuis `JWT_SECRET` dans `.env` (fichier local ignoré par Git). Avant tout déploiement, la remplacer par une valeur aléatoire forte, définir une durée d'expiration adaptée et utiliser HTTPS.

## État de la sécurité et de l'exploitation

La base actuelle n'intègre pas encore de garde d'authentification, CORS explicite, validation globale des requêtes, journalisation structurée, endpoint de santé dédié, connexion à une base de données ni variables d'environnement métier. Toute mise en production devrait compléter ces sujets selon les besoins fonctionnels et l'environnement cible.
