# TP3 — Demande de phénomène paranormal

Site fictif où le visiteur "demande" à vivre une expérience paranormale. Le
site est présenté comme un vrai système d'exploitation (thème Windows 95 /
écran CRT) : chaque page est une fenêtre d'explorateur de fichiers.

Réalisé par Rémy Lapalme dans le cadre du cours Technique d'intégration des
interfaces Web 2 (TP3).

- Dépôt Git : https://github.com/RemyLap/TP3_LapalmeRemy
- Site hébergé (GitHub Pages) : https://remylap.github.io/TP3_LapalmeRemy/

## Structure du projet

```
index.html          Page Accueil
dossiers.html        Page Mes Dossiers
demande.html          Page Propriétés — Demande XR-119 (formulaire)
corbeille.html       Page Corbeille
css/
  input.css           Source Tailwind + styles BEM personnalisés
  output.css          CSS compilé (généré par Tailwind, servi tel quel sur GitHub Pages)
js/                   Scripts par page (validation, interactions, horloge)
assets/               Icônes PWA, images, captures d'écran
manifest.webmanifest  Manifest PWA
sw.js                 Service worker (cache / hors-ligne)
```

## Développement

```
npm install
npm run watch:css   # recompile css/output.css en continu pendant le développement
npm run build:css   # build minifié avant un commit
```

## Composantes Tailwind

Composantes construites avec les utilitaires Tailwind (grille, flexbox,
espacement, couleurs arbitraires), restylées entièrement en thème Windows 95
via BEM. Inspirées des patrons officiels suivants :

1. **Fenêtres popup de l'accueil** (`.popup`) — inspirées du composant
   [Modal](https://tailwindui.com/components/application-ui/overlays/modals)
   de Tailwind UI (structure superposée avec en-tête, corps et bouton de
   fermeture).
2. **Grille de dossiers** (`.folder-grid`, page Dossiers) — inspirée du
   composant [Grid list](https://tailwindui.com/components/application-ui/lists/grid-lists)
   de Tailwind UI, réalisée avec `grid grid-cols-12` et les points de rupture
   `sm:`/`md:`.
3. **Formulaire à onglets** (`.dialog__tabs`, page Demande) — inspiré du
   composant [Tabs](https://tailwindui.com/components/application-ui/navigation/tabs)
   de Tailwind UI (onglets "Général" / "Avancé" avec `aria-selected` et
   panneaux basculés en JS).

## Animations

Animations CSS personnalisées (`@keyframes`), écrites pour ce projet selon la
technique standard documentée par
[MDN — Utiliser les animations CSS](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_animations/Using_CSS_animations) :

1. **Ouverture des popups** (`popup-in` / `popup-out`) — fondu + léger
   déplacement/zoom à l'apparition et à la fermeture des fenêtres popup de
   l'accueil.
2. **Effet écran CRT** (`crt-sweep`, `crt-flicker`, `crt-static`,
   `crt-glitch-slice`) — balayage lumineux, scintillement, bruit statique et
   glitch chromatique superposés à tout le site pour l'ambiance rétro.
3. **Restauration d'un élément de la Corbeille** (`trash-item-flash`) — flash
   bref au moment où un élément est restauré ou supprimé.
4. **Jauge système instable** (`system-glitch-shake`) — vibration du
   pourcentage et de la barre de progression après la découverte du fichier
   caché "6-7" (voir `js/dossiers.js`).

Toutes ces animations respectent `prefers-reduced-motion` et sont désactivées
pour les visiteurs qui préfèrent moins de mouvement.
