# TaskFlow — Dossier de Projet

## Équipe

| Nom | Prénom | GitHub |
|-----|--------|--------|
|Blanchet|Arthur|arthurblanchet59|
|Ilarraz|Hugo|Violetow9|

---

## Stack technique

| Couche          | Technologie                  |
|-----------------|------------------------------|
| Frontend        | Next.js (App Router) + React |
| Backend         | NestJS                       |
| Base de données | PostgreSQL + ORM             |
| Tests           | Jest + Testing Library       |
| CI              | GitHub Actions               |
| Déploiement     | Docker + Docker Compose      |

---

## Architecture — Vue d'ensemble

Schéma détaillé : [`docs/architecture.md`](docs/architecture.md)

---

## ADR — Architecture Decision Records

| ADR                        | Titre | Statut |
|----------------------------|-------|--------|
| [ADR-001](docs/ADR-001.md) | Choix des technologies      |  Accepté      |
| [ADR-002](docs/ADR-002.md) | Choix de l'architecture applicative | Accepté |
| [ADR-003](docs/ADR-003.md) | Gestion des événements domaine | Accepté |
| [ADR-004](docs/ADR-004.md) | Système de notifications événementiel | Accepté |
| [ADR-005](docs/ADR-005.md) | Audit trail des actions Task et Project | Accepté |
| [ADR-006](docs/ADR-006.md) | CLI d'administration comme adaptateur entrant | Accepté |
| [ADR-007](docs/ADR-007.md) | Authentification JWT découplée du métier | Accepté |
| [ADR-008](docs/ADR-008.md) | Temps réel via WebSocket scopé par projet | Accepté |

---

## Tags de rendu

| Phase   | Tag attendu | Statut |
|---------|-------------|--------|
| Rendu 1 | `rendu-1`   | Poussé |
| Rendu 2 | `rendu-2`   | À pousser à la fin de la Phase 2 |
| Rendu 3 | `rendu-3`   |        |

---

## Rendu 1 — Fondations *(7h30)*

### Checklist

- [x] Module `project` (controller / service / repository / interface)
- [x] Module `task` avec Value Object `TaskStatus` (transitions Todo → In Progress → Done)
- [x] Publication d'au moins deux domain events (`task.created`, `task.moved`)
- [x] `ConsoleListener` branché sur ces deux events (affiche event + taskId + horodatage dans la console)
- [x] Couche repository abstraite (interface + implémentation ORM)
- [x] Frontend : page unique, colonnes Kanban, déplacement de tâche (bouton suffit)
- [x] Tests unitaires des services (transitions de statut + publication d'events, sans BDD)
- [x] Authentification non requise — identifiant utilisateur simulé (`X-User-Id` ou constante)
- [x] Procédure de démarrage locale simple et documentée
- [x] 3 ADR minimum
- [x] Schéma d'architecture
- [x] Tag `rendu-1` créé et poussé

---

## Rendu 2 — Évolution *(13h30)*

### Disruption reçue

Cinq chantiers produit + une contrainte ops :

1. **Authentification JWT** (inscription, connexion, token), pensée pour un futur SSO sans toucher au métier.
2. **Temps réel sur le Kanban**, scopé par projet, mécanisme remplaçable sans réécrire le métier.
3. **Notifications événementielles** sur `task.assigned` et `task.moved`, canaux email + in-app, préférences par utilisateur, ouvert à de nouveaux canaux (Slack/Teams/SMS).
4. **Audit trail automatique** sur toutes les écritures Task/Project, sans polluer le métier, stockage remplaçable.
5. **CLI d'administration** réutilisant les cas d'usage applicatifs, sans dupliquer la logique.
6. **Mise en production** : `docker compose up` depuis un clone propre, `.env`/`.env.example`.

### Checklist

- [x] Authentification JWT (inscription, connexion, token)
- [x] Temps réel sur le Kanban (déplacement de tâche visible par tous, scope projet)
- [x] Notifications multi-canal extensibles (email + in-app) + préférences par canal
- [x] Audit trail automatique (qui a fait quoi et quand)
- [x] CLI d'administration (créer projet, créer tâche, seed de démo) — commande documentée dans le README
- [x] Docker Compose fonctionnel depuis un clone propre
- [x] `docker compose up` démarre tout avec un `.env.example` documenté
- [x] Pipeline CI GitHub Actions au vert
- [x] 5 nouveaux ADR (ADR-004 notifications, ADR-005 audit, ADR-006 CLI, ADR-007 auth, ADR-008 temps réel)
- [x] Schéma d'architecture mis à jour
- [x] Analyse d'impact : ce qui a changé vs ce qui n'a PAS changé
- [ ] Tag `rendu-2` créé et poussé

### Analyse d'impact

**Ce qui a changé :**

- Ajout d'un module `auth/` (presentation + application + infrastructure + domain) avec JWT, `JwtAuthGuard` global, `RolesGuard`, décorateurs `@Public()` / `@CurrentUser()` / `@Roles()`.
- Ajout d'un module `user/` (entités, repository, service) consommé par `AuthService`.
- Ajout d'un module `notification/` complet (channels `email` SMTP + `in_app`, listener `task.moved` / `task.assigned`, préférences user, contrôleurs REST).
- Ajout d'un module `audit/` (listener sur les 7 events métier, repository TypeORM, contrôleur de consultation).
- Ajout d'un module `cli/` avec `AdminCliCommand` (création projet/tâche, seed demo).
- Ajout d'une `TaskGateway` Socket.IO (rooms `project:${id}`) + `ServerListener` qui relaie les events sur le WebSocket.
- Events enrichis avec `actorId` pour permettre la traçabilité demandée par l'audit.
- Controllers `TaskController` et `ProjectController` reçoivent `@CurrentUser()` et propagent l'`actorId` aux services.
- `docker-compose.yml` : ajout de `mailpit` pour capturer les emails en local, ajout du service `web`.
- `.github/workflows/ci.yml` : pipeline lint + test + build pour `taskflow-api` et `taskflow-web`.

**Ce qui n'a PAS changé :**

- Le **domaine** `Task`, `Project` et leur Value Object `TaskStatus` : les règles de transition Todo → In Progress → Done, la règle "pas de doublon de membre", l'immutabilité des entités sont identiques au Rendu 1.
- Les **interfaces de repository** (`TaskRepository`, `ProjectRepository`) sont stables — les nouveaux modules ont leurs propres ports.
- Les **tests unitaires** existants des services métier restent inchangés ; aucun test ne touche la base.
- **Aucune** des nouvelles fonctionnalités (auth, temps réel, notifications, audit, CLI) n'est apparue dans `TaskService` ou `ProjectService` autrement que par la propagation d'un `actorId`. Le métier ne connaît pas l'email, le SMTP, le WebSocket, ni le canal Slack futur.
- L'ajout d'un canal de notification supplémentaire ne touchera ni `TaskService`, ni `ProjectService`, ni `TaskController` : il s'agit d'ajouter un nouvel adaptateur `NotificationChannel` et de l'enregistrer dans `NotificationModule`.

---

## Rendu 3 — Résilience *(16h30)*

### Disruptions reçues

> À résumer ici lors de la Phase 3.

### Checklist

- [ ] Résilience des consommateurs de notifications (canal email isolable)
- [ ] API v1 + v2 coexistantes et rétrocompatibles
- [ ] Analyse d'impact multi-workspace
- [ ] ADR résilience + versioning + multi-workspace
- [ ] Tableau des scénarios de panne
- [ ] Tag `rendu-3` créé et poussé

### Tableau des scénarios de panne

| Scénario                 | Comportement attendu                         | Comportement constaté |
|--------------------------|----------------------------------------------|-----------------------|
| Canal email indisponible | Le système continue, message mis en file     |                       |
| WebSocket coupé          | Kanban fonctionnel en mode requête classique |                       |

### Analyse d'impact

> Ce qui a changé :
> Ce qui n'a PAS changé :

---

## Soutenance *(20 min + 10 min de questions)*

### Plan

1. **Démo live** (5 min) — `docker compose up`, Kanban temps réel sur 2 navigateurs
2. **Ce qui n'a pas changé** (5 min) — Fichiers stables entre les phases, stabilité du domain
3. **Ce qu'on a appris** (5 min) — ADR dont on est le plus fier, choix qu'on referait différemment
4. **Métriques** (3 min) — `git diff --stat` entre chaque phase
5. **Questions libres** (2 min avant les questions de l'enseignant)

---

## Note finale

| Livrable             | Coefficient | Note    |
|----------------------|-------------|---------|
| Rendu 1 (Fondations) | × 0,20      | /20     |
| Rendu 2 (Évolution)  | × 0,25      | /20     |
| Rendu 3 (Résilience) | × 0,30      | /20     |
| Soutenance           | × 0,25      | /20     |
| **Note finale**      |             | **/20** |