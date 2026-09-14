# TP3 — Site de demande de phénomène paranormal

## Contexte du projet

TP3 final du cours Technique d'intégration des interfaces Web 2.
Travail individuel, remise le 15 septembre 2026.

## Concept

Site fictif où le visiteur "demande" à vivre une expérience paranormale (enlèvement,
possession, téléportation, etc.). Le site est présenté comme un vrai système
d'exploitation : chaque page est une fenêtre d'explorateur de fichiers, et naviguer
entre les pages revient à ouvrir un autre "dossier" du système (`C:\SYSTEM\<page>\<next page>\<next page>)`).
Le visiteur choisit un phénomène, remplit une demande officielle, et peut consulter
la corbeille pour voir ce qui a été supprimé/annulé.

Ton recherché : léger, un peu absurde — parodie plutôt qu'horreur. Thème
ancien Windows/rétro (vieil écran CRT) — le
design final est un vrai look Windows CRT, propre et crédible.

## Direction artistique finale (Windows 95)

- Chaque page est une **fenêtre d'explorateur de fichiers** : du style Windows 95
- 3 carrés gris en haut à droite de la barre de titre (boutons réduire/agrandir/fermer)
- Sous la barre de titre (nav) : **barre d'adresse** = "Adresse:" + champ blanc affichant
  `C:\SYSTEM\<nom-de-page><next page><next page>\` — c'est la nav principale du site, remplace un menu
  classique, les pages plus loin dans le fil d'Ariane sont plus pâles.

- (footer) Barre de statut tout en bas de chaque fenêtre (ex. "12 objet(s)", "statut: en ligne" et (la vraie heure)

## Structure du site — 4 pages, chacune 3 sections

### 1. Accueil (`C:\SYSTEM\accueil\`)

Pas de grille de fichiers ici — le corps de la fenêtre contient **3 mini-fenêtres
popup** flottantes, chacune avec sa propre barre de titre bleue et 3 boutons carrés gris en haut à droite de la barre de titre (boutons réduire/agrandir/fermer)
. Tailles différentes, décalées horizontalement (grande
popup centrée, moyenne décalée à droite, petite décalée à gauche) :

1. **"Bienvenue"** (la plus grande) — titre "Connexion établie", paragraphe d'intro,
   bouton bleu "Commencer →"
2. **"Comment ça fonctionne"** (moyenne) — un paragraphe de texte expliquant les
   étapes (pas de cartes numérotées, juste du texte)
3. **"À savoir"** (la plus petite) — court avertissement sur les dossiers corrompus/
   indisponibles

### 2. Dossiers (`C:\SYSTEM\dossiers\`) — titre de fenêtre "Mes Dossiers"

- **Section "Fichiers dans ce dossier"** : grille de **12 dossiers en 3 rangées de
  4** — Enlèvement (corrompu), Possession, Téléport, Contact, Régression, Double,
  ???? (corrompu), Invasion, Résurrection, Vision, Amnésie, Archives
- **Section "Dossier sélectionné"** : icône du dossier **à gauche**, texte **à
  droite** — nom en gras ("Possession.sys"), description, ligne de métadonnées
  (nombre de cas archivés, stabilité, réversibilité — ce dernier en rouge/orange
  comme avertissement)
- **Section "Statut du système"** : 3 cases statistiques (dossiers totaux /
  corrompus / % stabilité) + barre de progression "Intégrité du système" (dégradé
  orange→bleu)

### 3. Demande (page "Questionnaire") — dialogue "Propriétés — Demande XR-119"

Pas de barre d'adresse ici — c'est une boîte de dialogue avec onglets **Général**
(actif) / **Avancé** à la place. 10+ champs répartis en 3 sections :

- **"Identité"** : Nom (texte), Âge (texte), Genre (boutons radio: Homme/Femme/
  Autre), Ville (texte)
- **"Préférences de l'expérience"** : Type (menu déroulant), Date (sélecteur de
  date natif), Créneau (radio: Soir/Nuit/Aube), Courage (slider 1-10 avec valeur
  affichée)
- **"Contact et confirmation"** : Peur (texte), Apporter (cases à cocher multiples:
  Objet personnel/Photo/Rien), Urgence (texte), Signature (texte), case à cocher
  finale "J'accepte les conditions de traitement"
- Boutons **Annuler** (gris) / **OK** (bleu, primaire) en bas de la fenêtre

### 4. Corbeille (`C:\SYSTEM\corbeille\`)

- **Section "Contenu"** : liste de 4 éléments supprimés (Dossier_0203,
  Temoin_supprime, backup_ancien, rapport_final), chacun avec la **même icône de
  dossier jaune** que la page Dossiers (juste en plus petit, légèrement atténuée) et
  le nom **barré**
- **Section "Résumé"** : deux stats côte à côte — "Éléments: 4" et "Espace occupé:
  12,4 Mo"
- **Section "Action"** : bouton bleu "Restaurer tout"

## Easter eggs / humour à intégrer

- Le dossier "????" reste volontairement mystérieux/jamais expliqué
- Petites lignes humoristiques dans le formulaire (effets secondaires absurdes)
- Possibilité d'ajouter un fichier caché non listé dans la grille de dossiers en le restaurant de la corbeille

## Exigences techniques du TP (critères de notation)

- Git dès le début du développement, individuel, hébergé sur GitHub Pages, lien
  dans la page de présentation doit faire un commit pour chaque section/partie/morceau
- Grille Tailwind responsive 12 colonnes, fonctionnel jusqu'à ~500px de largeur
- PWA : manifest complet (3+ icônes maskables incl. 192x192, 144x144, 512x512, nom,
  nom court, description, url de départ, type d'affichage, couleur de fond, couleur
  thème, capture d'écran), Service Worker fonctionnel, gestion de cache, fonctionnel
  hors-ligne, aucune erreur manifest dans l'inspecteur Chrome
- Minimum 3 composantes Tailwind, documentées dans le Readme avec liens vers les
  composants originaux — les popups de l'accueil, la grille de dossiers, et le
  formulaire à onglets sont de bons candidats
- Formulaire de 8+ inputs (on en a 10+, plusieurs types: texte/select/radio/date/
  checkbox/slider), validation JS personnalisée, validation HTML5 désactivée (10%)
- Interface graphique respectant les standards du web
- Minimum 3 effets d'animation (CSS ou JS), documentés dans le Readme avec leur
  source — ex: ouverture des popups, changement de la barre de progression,
  hover sur les dossiers
- Accessibilité de base, HTML5 valide (validation W3C sans erreur), méthodologie
  BEM (bloc\_\_element--modificateur)
- Minimum 4 pages, minimum 3 sections par page (excluant footer/navbar) — les 4
  pages ci-dessus respectent chacune ce minimum

## Remise

Fichier .txt sur LÉA contenant le lien du repo et le lien du site hébergé (GitHub
Pages)
