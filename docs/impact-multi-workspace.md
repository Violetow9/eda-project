# Analyse d'impact — Multi-workspace

## Contexte

TaskFlow doit évoluer vers un modèle multi-workspace : chaque entreprise cliente dispose d'un espace isolé. Un utilisateur peut appartenir à plusieurs workspaces et doit sélectionner un workspace avant d'accéder aux projets et aux tâches.

Cette analyse ne décrit pas une implémentation complète, mais les changements à prévoir pour absorber cette évolution sans déplacer la logique métier dans les controllers ou les handlers techniques.

---

## Couches impactées

### Domaine

Le domaine devra porter explicitement la notion de workspace.

Deux options sont possibles :

- ajouter `workspaceId` directement sur `Project` ;
- considérer que `Task` est isolée via son `projectId`, le projet portant le `workspaceId`.

Le choix recommandé est de placer `workspaceId` sur `Project`, car les tâches appartiennent déjà à un projet. Cela évite de dupliquer l'information sur toutes les tâches.

### Application

Les cas d'usage devront recevoir un contexte applicatif contenant :

```txt
actorId
workspaceId
```

Les services applicatifs ne doivent pas extraire eux-mêmes le workspace depuis HTTP ou JWT. Cette extraction reste la responsabilité des adaptateurs entrants.

### Infrastructure

Les repositories devront filtrer les données par `workspaceId`.

Exemples :

- `ProjectRepository.findAllByWorkspaceId(workspaceId)` ;
- `ProjectRepository.findOneInWorkspace(projectId, workspaceId)` ;
- pour les tâches, vérification via le projet associé.

Le stockage TypeORM devra ajouter une colonne `workspaceId` sur la table `projects`.

### Présentation / API

L'API devra garantir que chaque requête est exécutée dans un workspace courant.

Le workspace pourra être transmis par :

- un header `X-Workspace-Id` ;
- une route `/api/v1/workspaces/:workspaceId/...` ;
- un claim dans le token après sélection du workspace.

---

## Où placer `workspaceId`

Le `workspaceId` doit être placé :

- sur `Project` ;
- dans les commandes applicatives ;
- dans les events métier ;
- dans les logs d'audit ;
- dans les rooms WebSocket.

Exemple de room WebSocket future :

```txt
workspace:{workspaceId}:project:{projectId}
```

---

## Isolation côté API

L'isolation doit être garantie côté backend :

1. l'utilisateur est authentifié ;
2. l'utilisateur appartient au workspace demandé ;
3. la ressource demandée appartient à ce workspace ;
4. les repositories filtrent systématiquement avec `workspaceId`.

Un guard ou un service d'accès doit vérifier l'appartenance au workspace.

---

## Pourquoi un filtre frontend est insuffisant

Un filtre frontend ne protège rien.

Un utilisateur pourrait :

- modifier l'URL ;
- appeler l'API directement avec Postman ou curl ;
- deviner un identifiant de projet ;
- contourner l'interface graphique.

L'isolation doit donc être garantie par le backend et par les requêtes de persistance.

---

## Comment éviter de réécrire `TaskService` et `ProjectService`

L'évolution doit être absorbée en ajoutant un contexte applicatif aux cas d'usage.

```ts
export type RequestContext = {
  actorId: string;
  workspaceId: string;
};
```

Les controllers, la CLI ou les futurs adaptateurs mobiles construisent ce contexte, puis l'envoient aux cas d'usage.

Les règles métier principales restent inchangées :

- créer un projet ;
- créer une tâche ;
- déplacer une tâche ;
- ajouter un membre.

Ce qui change est le périmètre d'accès aux données, porté par les repositories et par les guards.

---

## Conclusion

Le multi-workspace impacte principalement :

- les modèles de persistance ;
- les repositories ;
- les guards d'accès ;
- les DTO ou contextes applicatifs ;
- les events et rooms temps réel.

La logique métier principale ne doit pas être déplacée dans les controllers. L'architecture événementielle et hexagonale actuelle permet d'ajouter cette isolation en enrichissant les ports et les cas d'usage avec un contexte `workspaceId`.
