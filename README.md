# TP3 — Demande de phénomène paranormal

Site fictif où le visiteur "demande" à vivre une expérience paranormale. Le
site est présenté comme un vrai système d'exploitation (thème Windows 95 /
écran CRT) : chaque page est une fenêtre d'explorateur de fichiers.

Réalisé par Rémy Lapalme dans le cadre du cours Technique d'intégration des
interfaces Web 2 (TP3).

- Dépôt Git : https://github.com/RemyLap/TP3_LapalmeRemy
- Site hébergé (GitHub Pages) : à venir

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

_À documenter au fur et à mesure de l'intégration._

## Animations

_À documenter au fur et à mesure de l'intégration._
