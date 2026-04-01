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

> Insérer ici un schéma d'architecture (image ou dessin libre)

---

## ADR — Architecture Decision Records

> Chaque ADR est un fichier séparé dans `docs/`. Utilisez le template [`docs/ADR-template.md`](docs/ADR-template.md) et
> l'exemple [`docs/ADR-000.md`](docs/ADR-000.md).
>
> Listez ici vos ADR une fois créés :

| ADR                        | Titre | Statut |
|----------------------------|-------|--------|
| [ADR-001](docs/ADR-001.md) | Choix des technologies      |  Accepté      |
| [ADR-002](docs/ADR-002.md) |Choix de l’architecture applicative|Accepté|
| [ADR-003](docs/ADR-003.md) |Gestion des événements domaine|Accepté|

---

## Tags de rendu

| Phase   | Tag attendu | Statut |
|---------|-------------|--------|
| Rendu 1 | `rendu-1`   |        |
| Rendu 2 | `rendu-2`   |        |
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
- [ ] Schéma d'architecture
- [ ] Tag `rendu-1` créé et poussé

---

## Rendu 2 — Évolution *(13h30)*

### Disruption reçue

> Résumer ici les changements demandés par le "client"

### Checklist

- [ ] WebSocket temps réel (déplacement de tâche visible par tous)
- [ ] Notifications multi-canal extensibles (email + in-app)
- [ ] Multi-tenant basique (workspaceId)
- [ ] Docker Compose (production + staging)
- [ ] `docker compose up` fonctionnel depuis un clone propre
- [ ] Pipeline CI GitHub Actions au vert
- [ ] 3 nouveaux ADR (WebSocket, Notifications, Multi-tenant)
- [ ] Schéma d'architecture mis à jour
- [ ] Analyse d'impact : ce qui a changé vs ce qui n'a PAS changé
- [ ] Tag `rendu-2` créé et poussé

### Analyse d'impact

> Ce qui a changé :
> Ce qui n'a PAS changé :

---

## Rendu 3 — Résilience *(16h30)*

### Disruptions reçues

> Résumer ici les changements demandés par le "client"

### Checklist

- [ ] Circuit breaker sur le canal email
- [ ] API v1 + v2 coexistantes et rétrocompatibles
- [ ] Audit trail automatique (qui a fait quoi et quand)
- [ ] ADR résilience + versioning + audit
- [ ] Tableau des scénarios de panne
- [ ] Tag `rendu-3` créé et poussé

### Tableau des scénarios de panne

| Scénario                 | Comportement attendu                         | Comportement constaté |
|--------------------------|----------------------------------------------|-----------------------|
| Canal email indisponible | Le système continue, message mis en file     |                       |
| WebSocket coupé          | Kanban fonctionnel en mode requête classique |                       |
|                          |                                              |                       |

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
