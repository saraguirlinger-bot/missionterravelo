# Mission Terra Vélo — SGN Première STMG

Serious game (chapitres 1 à 3 de sciences de gestion et numérique). HTML, CSS et JavaScript uniquement : aucun serveur, aucun compte élève.

## Mise en ligne sur GitHub Pages
1. Créer un dépôt (ex. `mission-terra-velo`) sur le compte saraguirlinger-bot.
2. Déposer `index.html` et les dossiers `css/` et `js/` à la racine.
3. Settings → Pages → Branch `main`, dossier `/ (root)`.

## Fichiers
- `js/data.js` : tout le contenu pédagogique (situations, réponses, indices, explications). À modifier pour ajuster une question.
- `js/engine.js` : moteur (progression, feedback en 3 temps, scores, résultats, code).
- `css/style.css` : charte Horizon PME.

## Enseignant
- Espace enseignant : `…/index.html#/prof` (lien en bas de la page d'accueil) pour vérifier un code.
- Code `TV-35-XXXXX` : 35 demi-points = 17,5 / 20, lié au prénom, nom et classe.
- Progression enregistrée dans le navigateur de l'élève (localStorage).
