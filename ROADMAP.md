# WTI - Roadmap d'Implementation

## Vue d'ensemble

| Phase | Nom | Statut | Description |
|-------|-----|--------|-------------|
| 1 | Foundation | ✅ Done | Setup monorepo, types, themes, i18n |
| 2 | OpenAPI Core | 🔲 Todo | Parser OpenAPI + UI de base |
| 3 | UI Components | 🔲 Todo | Composants complets + polish |
| 4 | Auth System | 🔲 Todo | Authentification modulaire |
| 5 | gRPC Support | 🔲 Todo | gRPC Reflection + client |
| 6 | Distribution | 🔲 Todo | Build lib + Web Component |
| 7 | Extras | 🔲 Todo | Code snippets, historique |

---

## Phase 2: OpenAPI Core

**Objectif**: Parser les specs OpenAPI et afficher la liste des operations.

### 2.1 Parser OpenAPI (`packages/core/src/openapi/`)

| Fichier | Description |
|---------|-------------|
| `parser.ts` | Fonction principale `parseOpenApi(spec: unknown): ApiSpec` |
| `resolver.ts` | Resolution des `$ref` (JSON pointers) |
| `validator.ts` | Validation basique de la structure OpenAPI |
| `converter.ts` | Conversion OpenAPI -> types unifies |
| `index.ts` | Exports publics |

**Taches**:
- [ ] Parser OpenAPI 3.0 et 3.1
- [ ] Resoudre les references `$ref` internes
- [ ] Extraire operations, parametres, schemas
- [ ] Gerer les `servers` et variables
- [ ] Extraire les security schemes

### 2.2 HTTP Client (`packages/core/src/http/`)

| Fichier | Description |
|---------|-------------|
| `client.ts` | Wrapper fetch avec interceptors |
| `builder.ts` | Construction des requetes depuis Operation |
| `index.ts` | Exports publics |

**Taches**:
- [ ] Fetch wrapper avec timeout
- [ ] Construction URL avec path/query params
- [ ] Gestion headers
- [ ] Mesure du timing (duration)
- [ ] Parsing reponse (JSON, text, blob)

### 2.3 Composants UI Sidebar (`packages/ui/src/components/`)

| Fichier | Description |
|---------|-------------|
| `Sidebar/Sidebar.tsx` | Container sidebar |
| `Sidebar/SearchBar.tsx` | Barre de recherche |
| `Sidebar/OperationTree.tsx` | Arbre des operations par tag |
| `Sidebar/OperationItem.tsx` | Item operation avec badge methode |
| `Sidebar/ServerSelector.tsx` | Dropdown selection serveur |
| `Sidebar/index.ts` | Exports |

**Taches**:
- [ ] Afficher titre API + version
- [ ] Liste operations groupees par tag
- [ ] Badge colore par methode HTTP (GET=vert, POST=bleu, etc.)
- [ ] Recherche filtrant operations
- [ ] Selection serveur actif
- [ ] Expand/collapse des tags

### 2.4 Composants UI Main Panel (`packages/ui/src/components/`)

| Fichier | Description |
|---------|-------------|
| `Operation/OperationHeader.tsx` | Titre, methode, path, description |
| `Operation/OperationPanel.tsx` | Container principal |
| `Operation/index.ts` | Exports |

**Taches**:
- [ ] Afficher methode + path + summary
- [ ] Description avec markdown basique
- [ ] Tags de l'operation
- [ ] Indicateur deprecated

---

## Phase 3: UI Components

**Objectif**: Formulaires parametres, editeur body, affichage reponses.

### 3.1 Formulaire Parametres (`packages/ui/src/components/Parameters/`)

| Fichier | Description |
|---------|-------------|
| `ParametersForm.tsx` | Container du formulaire |
| `ParamInput.tsx` | Input dynamique selon schema |
| `ParamGroup.tsx` | Groupe par location (path/query/header) |

**Taches**:
- [ ] Grouper params par location
- [ ] Input text pour string
- [ ] Input number pour integer/number
- [ ] Checkbox pour boolean
- [ ] Select pour enum
- [ ] Indicateur required/optional
- [ ] Validation selon schema (min, max, pattern)
- [ ] Valeurs par defaut

### 3.2 Editeur Request Body (`packages/ui/src/components/RequestBody/`)

| Fichier | Description |
|---------|-------------|
| `RequestBodyEditor.tsx` | Container avec tabs JSON/Form |
| `JsonEditor.tsx` | Editeur JSON avec syntax highlight |
| `FormEditor.tsx` | Formulaire genere depuis schema |

**Taches**:
- [ ] Toggle JSON brut / formulaire
- [ ] Editeur JSON avec validation
- [ ] Syntax highlighting basique
- [ ] Generation formulaire depuis schema
- [ ] Support nested objects
- [ ] Support arrays

### 3.3 Affichage Response (`packages/ui/src/components/Response/`)

| Fichier | Description |
|---------|-------------|
| `ResponseViewer.tsx` | Container response |
| `StatusBadge.tsx` | Badge status code colore |
| `HeadersTable.tsx` | Table des headers |
| `BodyViewer.tsx` | Affichage body JSON/text |
| `TimingInfo.tsx` | Duree, taille |

**Taches**:
- [ ] Badge status (2xx=vert, 4xx=orange, 5xx=rouge)
- [ ] Affichage headers en table
- [ ] JSON viewer avec collapse/expand
- [ ] Formatage automatique JSON
- [ ] Copier response
- [ ] Affichage timing + taille

### 3.4 Composants Primitifs (`packages/ui/src/components/primitives/`)

| Fichier | Description |
|---------|-------------|
| `Button.tsx` | Bouton avec variants |
| `Input.tsx` | Input text style |
| `Select.tsx` | Select dropdown |
| `Checkbox.tsx` | Checkbox |
| `Badge.tsx` | Badge/tag |
| `Tabs.tsx` | Composant tabs |
| `Accordion.tsx` | Accordion expand/collapse |
| `Toast.tsx` | Notifications toast |
| `Modal.tsx` | Modal dialog |
| `Drawer.tsx` | Drawer lateral |
| `Tooltip.tsx` | Tooltip hover |

---

## Phase 4: Auth System

**Objectif**: Support complet des methodes d'authentification.

### 4.1 Auth Store (`packages/ui/src/stores/`)

| Fichier | Description |
|---------|-------------|
| `auth.ts` | Store etat authentification |

**Taches**:
- [ ] Stocker configs auth par scheme
- [ ] Persistance localStorage
- [ ] Appliquer auth aux requetes

### 4.2 Auth UI (`packages/ui/src/components/Auth/`)

| Fichier | Description |
|---------|-------------|
| `AuthPanel.tsx` | Panel/drawer auth |
| `ApiKeyForm.tsx` | Formulaire API Key |
| `BearerForm.tsx` | Formulaire Bearer token |
| `BasicForm.tsx` | Formulaire Basic auth |
| `OAuth2Form.tsx` | Formulaire OAuth2 |
| `AuthStatus.tsx` | Indicateur status auth |

**Taches**:
- [ ] UI API Key (header/query/cookie)
- [ ] UI Bearer token
- [ ] UI Basic (username/password)
- [ ] OAuth2 Authorization Code flow
- [ ] OAuth2 Client Credentials flow
- [ ] Indicateur "Authorized" dans header
- [ ] Bouton logout/clear

### 4.3 Integration HTTP Client

**Taches**:
- [ ] Interceptor pour injecter auth headers
- [ ] Refresh token automatique (OAuth2)
- [ ] Gestion expiration token

---

## Phase 5: gRPC Support

**Objectif**: Decouverte et appel de services gRPC via reflection.

### 5.1 gRPC Client (`packages/core/src/grpc/`)

| Fichier | Description |
|---------|-------------|
| `client.ts` | Client gRPC-Web |
| `reflection.ts` | Implementation Server Reflection |
| `converter.ts` | Conversion proto -> types unifies |
| `index.ts` | Exports |

**Dependances**:
```json
{
  "@bufbuild/protobuf": "^2.0",
  "@connectrpc/connect-web": "^1.4"
}
```

**Taches**:
- [ ] Client gRPC-Web basique
- [ ] Implementation grpc.reflection.v1
- [ ] Parser FileDescriptorProto
- [ ] Extraire services et methodes
- [ ] Convertir vers model unifie ApiSpec
- [ ] Support unary calls
- [ ] Support server streaming (basique)

### 5.2 UI Adaptations

**Taches**:
- [ ] Detecter type spec (OpenAPI vs gRPC)
- [ ] Adapter formulaire pour messages proto
- [ ] Afficher reponse proto
- [ ] Badge "GRPC" pour methodes

---

## Phase 6: Distribution

**Objectif**: Packages prets a publier.

### 6.1 Build Library (`packages/ui/`)

**Taches**:
- [ ] Vite library mode config
- [ ] Externaliser solid-js
- [ ] Generer .d.ts
- [ ] Bundle CSS separement
- [ ] Tree-shaking optimise
- [ ] Tester import dans projet externe

### 6.2 Web Component (`packages/web-component/`)

**Taches**:
- [ ] Bundle standalone (IIFE)
- [ ] Inclure solid-js + CSS
- [ ] Tester dans HTML vanilla
- [ ] Documenter attributs custom element
- [ ] Shadow DOM optionnel

### 6.3 Demo App (`apps/demo/`)

**Taches**:
- [ ] Page demo complete
- [ ] Toggle theme
- [ ] Toggle locale
- [ ] Plusieurs specs exemples
- [ ] Deploy sur Vercel/Netlify

---

## Phase 7: Extras

**Objectif**: Fonctionnalites additionnelles.

### 7.1 Code Snippets (`packages/core/src/codegen/`)

| Fichier | Description |
|---------|-------------|
| `generator.ts` | Interface generateur |
| `curl.ts` | Template cURL |
| `javascript.ts` | Template fetch JS |
| `python.ts` | Template requests Python |
| `go.ts` | Template net/http Go |
| `index.ts` | Exports |

**Taches**:
- [ ] Interface CodeGenerator
- [ ] Template cURL
- [ ] Template JavaScript (fetch)
- [ ] Template Python (requests)
- [ ] Template Go (net/http)
- [ ] UI panel code snippets
- [ ] Bouton copier

### 7.2 Historique Requetes (`packages/ui/src/stores/`)

| Fichier | Description |
|---------|-------------|
| `history.ts` | Store historique |

**Taches**:
- [ ] Stocker requetes/reponses
- [ ] Limite 100 entrees
- [ ] Persistance localStorage
- [ ] UI drawer historique
- [ ] Rejouer une requete
- [ ] Effacer historique

### 7.3 Export/Import Config

**Taches**:
- [ ] Export JSON (auth + settings)
- [ ] Import JSON
- [ ] UI boutons export/import

---

## Conventions de Code

### Structure Composant SolidJS

```typescript
// Component.tsx
import { Component, createSignal } from 'solid-js';
import * as styles from './Component.css';

interface ComponentProps {
  value: string;
  onChange?: (value: string) => void;
}

export const Component: Component<ComponentProps> = (props) => {
  return (
    <div class={styles.root}>
      {props.value}
    </div>
  );
};
```

### Structure Fichier CSS (Vanilla Extract)

```typescript
// Component.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../themes/contract.css';

export const root = style({
  padding: vars.spacing[4],
  backgroundColor: vars.colors.bg,
});
```

### Nommage

- **Composants**: PascalCase (`OperationTree.tsx`)
- **Fichiers CSS**: `Component.css.ts`
- **Stores**: camelCase (`specStore.ts`)
- **Types**: PascalCase (`interface ApiSpec`)
- **Fonctions utilitaires**: camelCase (`parseOpenApi`)

---

## Commandes

```bash
# Dev
bun run dev                    # Lance demo app
bun run --filter @wti/ui dev   # Dev UI package seul

# Build
bun run build                  # Build tous les packages
bun run --filter @wti/core build

# Test
bun test                       # Tous les tests
bun test packages/core         # Tests core seulement

# Lint
bun run lint                   # Check
bun run lint:fix               # Fix auto

# Typecheck
bun run typecheck              # Tous les packages
```

---

## Definition of Done

Une tache est consideree terminee quand:

1. [ ] Code implemente et fonctionnel
2. [ ] Types TypeScript corrects (pas de `any`)
3. [ ] Pas d'erreurs lint (biome)
4. [ ] Tests unitaires si logique complexe
5. [ ] i18n: tous les textes traduits (en/fr)
6. [ ] Responsive: fonctionne sur mobile
7. [ ] Accessible: navigation clavier, aria labels
