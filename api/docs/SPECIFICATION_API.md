# Spécification de l'API Tempolis

**Version documentée :** `0.0.1`  
**État :** API de démarrage (une route publique)

## URL de base

En local, l'application écoute sur `http://localhost:3000` par défaut. La variable d'environnement `PORT` permet de remplacer ce port.

## Conventions HTTP

- Les échanges utilisent HTTP.
- La seule réponse actuelle est du texte brut (`text/html; charset=utf-8`).
- Aucun préfixe global d'URL, mécanisme d'authentification, versionnement d'URL ni limite de débit n'est configuré à ce stade.
- Les erreurs non gérées suivent le format d'erreur par défaut de NestJS.

Les endpoints `/auth` utilisent des jetons JWT. Après une connexion réussie, transmettre le jeton avec l'en-tête `Authorization: Bearer <accessToken>`.

## Endpoints

### Vérification de disponibilité

`GET /`

Retourne le message de bienvenue de l'API. Cet endpoint peut servir de contrôle de disponibilité très simple, mais il ne vérifie pas de dépendance externe car aucune n'est encore raccordée.

| Élément | Valeur |
| --- | --- |
| Authentification | Aucune |
| Paramètres de chemin | Aucun |
| Paramètres de requête | Aucun |
| Corps de requête | Aucun |
| Réponse de succès | `200 OK` |
| Type de contenu | `text/html; charset=utf-8` |

Réponse :

```text
Hello World!
```

### Inscription d'un utilisateur

`POST /auth/register`

Crée un utilisateur relié à une structure existante, hache son mot de passe avec bcrypt et retourne un jeton JWT. Le champ `motDePasse` n'est jamais renvoyé ni stocké en clair.

| Élément | Valeur |
| --- | --- |
| Authentification | Aucune |
| Corps | JSON |
| Réponse de succès | `201 Created` |

```json
{
  "nom": "Dupont",
  "prenom": "Alice",
  "email": "alice@example.com",
  "motDePasse": "MotDePasseSecurise1!",
  "matricule": "EMP-001",
  "role": "employe",
  "structureId": "id-de-la-structure-existante"
}
```

Erreurs possibles : `400` (données invalides ou structure inexistante), `409` (e-mail déjà utilisé).

### Connexion

`POST /auth/login`

Vérifie l'e-mail et le mot de passe hashé de la table `utilisateurs`, puis retourne un jeton d'accès JWT.

```json
{
  "email": "alice@example.com",
  "motDePasse": "MotDePasseSecurise1!"
}
```

Réponse `201 Created` :

```json
{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "utilisateur": {
    "id": "...",
    "nom": "Dupont",
    "prenom": "Alice",
    "email": "alice@example.com",
    "matricule": "EMP-001",
    "role": "employe"
  }
}
```

Erreur possible : `401` si les identifiants sont incorrects.

### Profil connecté

`GET /auth/profile`

Route protégée qui retourne le profil de l'utilisateur correspondant au JWT.

```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <accessToken>"
```

Réponses : `200 OK`, `401 Unauthorized` si le jeton est absent, invalide ou expiré.

Exemple :

```bash
curl -i http://localhost:3000/
```

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

Hello World!
```

## Hors périmètre actuel

Les ressources Tempolis autres que l'authentification et la persistance ne sont pas encore exposées par des endpoints CRUD. Elles ne doivent donc pas être considérées comme faisant partie du contrat de cette version.
