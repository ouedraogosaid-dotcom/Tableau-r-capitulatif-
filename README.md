# Registre récapitulatif

Tableau récapitulatif de classe pour l'école primaire, sous forme d'application web installable (PWA) qui fonctionne hors ligne.

## Fonctionnalités

- **Saisie** : en-tête (inspection, école, classe, année scolaire, directeur, maître) et liste des élèves (matricule, nom, sexe, âge, scolarité en classe, scolarité totale).
- **Scolarité** : tableaux de scolarité garçons / filles.
- **Alphabétique** : liste générale triée par nom.
- **Synthèse** : effectifs, redoublants, tableau des âges, contrôles de cohérence, visas.
- **Feuille A4** : aperçu prêt à imprimer, enregistrement en HTML autonome (impression / PDF) et export CSV (séparateur `;`, compatible Excel).
- **Sauvegarde / restauration** : « Sauvegarder » enregistre toute la classe dans un fichier `.json` ; « Restaurer » la recharge (changement d'appareil, archivage d'une année). Si une classe est déjà saisie, un second clic est demandé avant de la remplacer.

Les données sont enregistrées automatiquement dans le navigateur (`localStorage`) ; rien n'est envoyé sur un serveur. Pensez à faire une sauvegarde régulièrement : vider les données du navigateur efface la classe.

## Utilisation

Aucune compilation ni dépendance : ce sont des fichiers statiques.

```sh
# servir le dossier localement (le service worker exige http:// ou https://)
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Pour publier, activer **GitHub Pages** sur la branche principale (Settings → Pages → *Deploy from a branch*, dossier `/`). Le navigateur proposera ensuite d'installer l'application.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Application complète (HTML, CSS et JavaScript) |
| `sw.js` | Service worker : cache hors ligne |
| `manifest.webmanifest` | Manifeste PWA (nom, couleurs, icônes) |
| `icon-*.png` | Icônes de l'application |

## Mise à jour

Les pages sont servies « réseau d'abord » : une nouvelle version de `index.html` est prise en compte au prochain chargement en ligne. Si vous ajoutez un fichier à mettre en cache, ajoutez-le à `FICHIERS` dans `sw.js` et incrémentez `CACHE`.
