# Portfolio 3D Interactif

> Portfolio moderne avec React Three Fiber et expérience 3D immersive

## 🌐 Demo
**Live Demo**: [https://adidevclick.github.io/3D_Portfolio/](https://adidevclick.github.io/3D_Portfolio/)

## 🛠 Tech Stack

### Core
- **React 19** + **TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **Maath** (animations easing)
- **React Spring**
- **Vite** (build tool)

### State Management
- **Hooks/Reducers** (migration Zustand en cours)
- **React Query** (API layer prévu)

### Performance
- **Frustum Culling** actif
- **Custom Animation Hooks** réutilisables
- **Conditional useFrame** optimization

## ✨ Features

### 🎮 Navigation 3D Immersive
- **Scroll/Drag naturel** (mobile/desktop)
- **Camera transitions** fluides entre sections
- **HUD 3D menu** (en développement)

### 🎨 Carousel 3D Projets
- **Cards 3D** avec profondeur (box geometry)
- **Animations interactives** (hover, click)
- **Collision system** intelligent
- **SVG → Modèles 3D** pipeline

### 🎭 Interface Moderne
- **Custom mesh text 3D** optimisé
- **CSS Houdini toggle** (light/dark mode)
- **Responsive design** adaptatif
- **Touch interactions** natives

## 🚀 Quick Start

```bash
# Clone
git clone <repository-url>
cd 3d-portfolio

# Install
npm install

# Dev server
npm run dev
```

## 📁 Architecture

```
src/
├── components/
│   ├── 3DComponents/     # Three.js components
│   │   ├── Scene/        # Main 3D scene
│   │   ├── Carousel/     # 3D project carousel
│   │   └── Cards/        # Interactive 3D cards
├── pages/
│   ├── Home/             # Landing 3D
│   ├── About/            # About section
│   └── Contact/          # Contact interface
├── hooks/
│   ├── animation/        # Custom animation system
│   └── reducers/         # State management
├── api/
│   ├── contexts/         # React contexts
│   └── draco/            # 3D compression config
└── configs/              # App configurations
```

## ⚡ Performance Features

### Frustum Culling
- **Automatic visibility check** sur tous éléments
- **useFrame conditionnel** seulement si page active
- **frameCount optimization** pour throttling

### Animation System
```typescript
// Custom reusable animation hook
const itemsToAnimate: AnimationItemType[] = [
    {
        ref: titleRef,
        type: 'position',
        effectOn: currentTitlePos,
        time: 0.3,
        animationType: easing.damp3
    }
];

useAnimateItems(itemsToAnimate, isActive, groupRef);
```

### Conditional Rendering
```typescript
// Performance-first approach
useFrame((state, delta) => {
    frameCountRef.current += 1;
    
    // Only execute when needed
    if (frameCountRef.current % 60 === 0) {
        frustumChecker([refs], state, frameCountRef.current, isMobile);
    }
});
```

## ⚙️ Configuration

### Carousel Settings
```typescript
// src/configs/3DCarousel.config.ts
export const SETTINGS = {
    CARDS_COUNT: 10,
    CARD_SCALE: 1,
    CONTAINER_SCALE: 5,
    BENDING: 0.1,
    THREED: true,
    COLLISIONS: true
};
```

### Debug Mode
```typescript
// Dev mode toggle (coming soon)
const DEV_MODE = {
    showFPS: true,
    liveSettings: true,
    performanceMonitor: true
};
```

## 🔮 Roadmap

### v1.1 - HUD System (Q1 2025)
- [x] HUD 3D buttons créés (Blender)
- [ ] Migration complète Zustand
- [ ] HUD menu intégré (4 pages navigation)
- [ ] Mobile carousel positioning fix
- [ ] Debug mode avec FPS counter

### v1.2 - Camera Experience (Q2 2025)
- [ ] **Camera pans** entre sections (+ scroll hybrid)
- [ ] Header removal (remplacé par HUD)
- [ ] Light/Dark mode 3D avec Houdini toggle
- [ ] Box geometry cards (6 faces + profondeur)

### v2.0 - Full Stack 3D (Q3-Q4 2025)
- [ ] **Express/Fastify API** + dashboard
- [ ] **React Query** integration
- [ ] Advanced 3D effects & shaders
- [ ] Tests unitaires complets
- [ ] Performance target: Lighthouse 85+

## 🎨 3D Assets Pipeline

### Custom Creations
- **Modèles 3D**: Créations Blender originales
- **Icons SVG → 3D**: Pipeline de conversion
- **Mesh Text**: Optimisé pour load instantané
- **Materials**: Couleurs procedurales (pas de textures)

### Optimization
- **Draco compression** pour modèles
- **Conditional loading** basé sur device
- **LOD system** (prévu v2.0)

## 🏆 Key Innovations

### Architecture Decisions
- **Configuration over Code** approach
- **Custom hooks** pour animations réutilisables
- **Separation of concerns** (3D/Logic/State)
- **Performance-first** development

### Technical Highlights
- **Zero HTML UI** (objectif v2.0)
- **Camera-driven UX** au lieu de scroll tricks
- **Real-time 3D debugging** tools
- **Immersive portfolio experience**

## 📄 License

MIT License

---

**Built with ❤️ and lots of ☕**
*Parce qu'on est en 3D bordel !* 🚀