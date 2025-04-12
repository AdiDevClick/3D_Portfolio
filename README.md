# Portfolio 3D Interactif

Un portfolio moderne utilisant React, Three.js et TypeScript pour créer une expérience utilisateur immersive en 3D.

## 🌟 Caractéristiques

### Carrousel 3D
- Affichage dynamique des projets en cercle
- Animations fluides et interactives
- Système de positionnement intelligent avec gestion des collisions
- Effets de courbure des cartes (bending)

### Interactions
- Hover : Mise en avant de la carte avec animations
- Click : Ouverture détaillée du projet
- Navigation fluide entre les projets
- Adaptation responsive (mobile/desktop)

## 🛠 Technologies

- React + TypeScript
- Three.js
- @react-three/fiber & @react-three/drei
- Maath (animations)
- Vite (build tool)

## 📁 Structure du Projet

```
src/
├── components/
│   ├── 3DComponents/
│   │   ├── Carousel/
│   │   │   ├── Carousel.tsx    # Composant principal
│   │   │   └── Functions.ts    # Logique d'animation
│   │   ├── Cards/
│   │   │   ├── CardContainer.tsx
│   │   │   └── CardMainTitle.tsx
│   │   └── Html/
│   │       └── HtmlContainer.tsx
│   └── projects/
│       └── ProjectContainer.tsx
├── hooks/
│   └── reducers/
│       └── carouselTypes.ts
└── configs/
    └── 3DCarousel.config.ts
```

## 🎮 Fonctionnalités Principales

### Système de Carrousel
```typescript
export function createCardProperties(
    SETTINGS: SettingsType,
    datas: ElementType[],
    i: number,
    self: ElementType[],
    id: string
) {
    // Configuration des propriétés de chaque carte
}
```

### Animations
```typescript
handleNormalAnimation(
    material,
    scale,
    rotation,
    cardHoverScale,
    cardHoverRadius,
    cardHoverZoom,
    delta
);
```

## 🚀 Installation

1. Cloner le repository
```bash
git clone <repository-url>
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer en développement
```bash
npm run dev
```

## ⚙️ Configuration

Les paramètres du carrousel sont configurables via le fichier `3DCarousel.config.ts` :

```typescript
export const SETTINGS = {
    CARDS_COUNT: 10,
    CARD_SCALE: 1,
    CONTAINER_SCALE: 5,
    BENDING: 0.1,
    THREED: true,
    COLLISIONS: true
};
```

## 📝 Notes de Développement

### Gestion des États
- Utilisation d'un reducer pour la gestion globale des cartes
- État local pour les animations spécifiques
- Système de référence pour les interactions 3D

### Optimisations
- Throttling des mises à jour de position
- Gestion efficace des collisions
- Animations optimisées avec Maath

## 🔜 Améliorations Prévues

- [x] Optimisation des performances
- [ ] Nouveaux effets de transition
- [ ] Amélioration du système de collision
- [ ] Support pour plus de types de contenu

## 📄 License

MIT License