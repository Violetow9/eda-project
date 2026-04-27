# Cheat Sheet — TaskFlow

Commandes essentielles pour le projet. À garder sous la main.

---

## CLI d’administration

La CLI s’exécute via Docker, sans installation locale de Node.
Il faut tout d'abord 

```bash
./cli.sh create-project "Projet démo"
./cli.sh create-task 1 "Ma tâche" user-1
./cli.sh seed-demo

.\cli.ps1 create-project "Projet Démo"
.\cli.ps1 create-task 1 "Ma première tâche" user-1
.\cli.ps1 seed-demo
```

## Lancement de l'application

```bash
## Start all services (postgresql + api + web + smtp)
make up

## Start only the API (postgresql + api)
make api

## Start only the web app
make web

## Stop all services
make down

## Follow logs for all services
make logs

```

---

## NestJS CLI

```bash
# Créer le projet
nest new taskflow-api

# Générer un module complet
nest g module project
nest g controller project
nest g service project

# Générer d'autres éléments
nest g guard    workspace
nest g interceptor audit
nest g filter   http-exception
nest g gateway  task-events
```

---

## ORM / persistance

### Stack de référence — Prisma

```bash
# Initialiser Prisma dans le projet
npx prisma init

# Créer et appliquer une migration (développement)
npx prisma migrate dev --name init
npx prisma migrate dev --name add-workspace

# Régénérer le client après une modification du schéma
npx prisma generate

# Ouvrir l'interface graphique de la BDD
npx prisma studio

# Appliquer les migrations en production (sans créer de fichier)
npx prisma migrate deploy
```

### Autre stack (TypeORM, Drizzle, Hibernate, SQLAlchemy…)

Adaptez les commandes ci-dessus à votre outil. Les concepts restent les mêmes :
initialisation du schéma, génération/application des migrations, déploiement en production.

---

## Docker & Docker Compose

```bash
# Démarrer tous les services en arrière-plan
docker compose up -d

# Voir les logs d'un service
docker compose logs -f api
docker compose logs -f web

# Redémarrer un service après une modification
docker compose up -d --build api

# Arrêter et supprimer les conteneurs (garder les volumes)
docker compose down

# Arrêter et supprimer TOUT (conteneurs + volumes + données)
docker compose down -v

# Vérifier l'état des services
docker compose ps
```

---

## Git — métriques d'architecture

```bash
# Voir les fichiers modifiés depuis le dernier commit
git diff --stat HEAD~1

# Comparer deux phases (tags ou commits)
git diff --stat rendu-1 rendu-2

# Historique compact
git log --oneline

# Créer un tag de rendu
git tag rendu-1
git push origin rendu-1

# Exemple pour les phases suivantes
git tag rendu-2
git push origin rendu-2
git tag rendu-3
git push origin rendu-3
```

---

## Tests Jest

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec couverture
npm run test:cov
```

### Exemple : test unitaire d'un service avec mock repository

Le principe : **ne jamais instancier l'ORM dans un test**. On injecte un faux repository en mémoire.

```typescript
// src/task/application/task.service.spec.ts
import { TaskService } from './task.service';
import { Task } from '../domain/task.entity';
import { TaskRepository } from '../domain/task.repository';

// Faux repository en mémoire — implémente l'interface, sans ORM
class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async save(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }
}

describe('TaskService', () => {
  let service: TaskService;
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    service = new TaskService(repository); // injection de dépendance
  });

  it('devrait déplacer une tâche et changer son statut', async () => {
    await repository.save({ id: '1', title: 'Fix bug', status: 'todo' });

    const result = await service.moveTask('1', 'in-progress');

    expect(result.status).toBe('in-progress');
  });

  it('devrait refuser de déplacer une tâche déjà terminée', async () => {
    await repository.save({ id: '2', title: 'Done task', status: 'done' });

    await expect(service.moveTask('2', 'in-progress')).rejects.toThrow();
  });
});
```

> La règle métier ("on ne peut pas déplacer une tâche terminée") est testée **sans base de données, sans NestJS, sans HTTP**. C'est exactement ce qu'on veut.

---

## Variables d'environnement

Créer un fichier `.env` à la racine de `taskflow-api/` :

```env
DATABASE_URL=postgresql://taskflow:password@localhost:5432/taskflow
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
```

> Ne jamais committer le fichier `.env`. Il est déjà exclu par le `.gitignore`.
> Fournir un fichier `.env.example` avec les clés (sans les valeurs sensibles).
