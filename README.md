# Maison

Planning de la maison pour 4 personnes : réservation de la salle de bain et du bureau, lave-vaisselle (remplir, lancer, vider, avec un tour de rôle) et liste de tâches libres ou attribuées. Tout est synchronisé en temps réel et chacun reçoit une notification sur son téléphone.

Coût : 0 fr. (GitHub Pages + Firebase gratuit + Cloudflare Workers gratuit).

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | L'app |
| `config.js` | **Le seul fichier à modifier** (Firebase + notifications) |
| `sw.js`, `manifest.json`, `icons/` | Installation sur l'écran d'accueil, hors-ligne, notifications |
| `cles.html` | Petite page pour générer les clés des notifications (une seule fois) |
| `worker/worker.js` | Serveur de notifications, à coller dans Cloudflare (ne pas mettre sur GitHub Pages, ou peu importe : il ne contient aucun secret) |

Sans configuration, l'app tourne en **mode démo** : tu peux déjà la tester, mais les données restent sur le téléphone.

---

## Étape 1 : mettre l'app en ligne (GitHub Pages)

1. Crée un dépôt `maison` sur GitHub et envoie tous les fichiers (sauf le dossier `worker` si tu préfères).
2. Settings > Pages > Branch `main`, dossier `/ (root)`.
3. Ouvre `https://TON-PSEUDO.github.io/maison/` : l'app démarre en mode démo.

## Étape 2 : synchroniser les 4 téléphones (Firebase)

Tu peux réutiliser un projet Firebase existant : les données sont rangées sous `familles/maison/…`.

1. Console Firebase > **Ajouter une app Web** > copie l'objet `firebaseConfig` dans `config.js`, à la place de `firebase: null`.
2. **Firestore Database** > Créer une base (région conseillée : `europe-west6`, Zurich).
3. **Authentication** > Méthode de connexion > active **Anonyme**.
4. Firestore > **Règles**, colle ceci puis Publier :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /familles/{famille}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Envoie le nouveau `config.js` sur GitHub. Le petit texte « Mode démo » disparaît : c'est synchronisé.

## Étape 3 : les notifications (Cloudflare Worker)

**3a. Générer les clés.** Ouvre `https://TON-PSEUDO.github.io/maison/cles.html`, touche « Générer les clés ». Garde la page ouverte pendant les étapes suivantes.

**3b. Créer le Worker.** Sur [dash.cloudflare.com](https://dash.cloudflare.com) (compte gratuit) :

1. Workers & Pages > Créer > Worker, nomme-le `maison-push` > Déployer.
2. Modifier le code > efface tout > colle le contenu de `worker/worker.js` > Déployer.

**3c. Le stockage des abonnements.** Stockage et bases de données > KV > crée un espace de noms `maison-subs`. Puis dans le Worker : Paramètres > Liaisons > Ajouter > Espace de noms KV, nom de la variable **`SUBS`**, espace `maison-subs`.

**3d. Les variables.** Worker > Paramètres > Variables et secrets, ajoute :

| Nom | Type | Valeur |
|---|---|---|
| `FAMILY_KEY` | Secret | depuis cles.html |
| `VAPID_PUBLIC` | Texte | depuis cles.html |
| `VAPID_PRIVATE_JWK` | Secret | depuis cles.html |
| `VAPID_SUBJECT` | Texte | `mailto:ton.adresse@email.com` (Apple refuse les notifications sans ça) |

**3e. Vérifier.** Ouvre l'adresse du Worker dans le navigateur. Tu dois voir `"ok":true` et `"manque":[]`. Sinon, la liste `manque` dit ce qui n'est pas lié.

**3f. Brancher l'app.** Dans `config.js`, colle le bloc donné par cles.html (`pushServer`, `pushKey`, `vapidPublic`) avec l'adresse de ton Worker, puis envoie sur GitHub.

## Étape 4 : installer sur les téléphones

**iPhone (iOS 16.4 ou plus)** : ouvre le lien dans **Safari** > bouton Partager > « Sur l'écran d'accueil ». Ouvre ensuite Maison **depuis l'icône** (sinon pas de notifications), choisis ton profil, touche ton avatar en haut à droite > « Activer les notifications » > Autoriser. Fais « Envoyer une notification de test » pour vérifier.

**Android** : ouvre le lien dans Chrome > menu ⋮ > « Installer l'application », puis pareil : profil > avatar > Activer les notifications.

Les prénoms et emojis se changent une seule fois dans les réglages (avatar), pour tout le monde.

---

## Qui reçoit quoi

| Événement | Notifié |
|---|---|
| Créneau réservé ou annulé (salle de bain, bureau) | Les 3 autres |
| Lave-vaisselle lancé | Les 3 autres (pour ne plus rien y mettre) |
| Lave-vaisselle propre | Celui qui vide |
| Lave-vaisselle vidé | Celui qui remplit (et celui qui vide, si quelqu'un l'a dépanné) |
| Nouvelle tâche libre | Les 3 autres |
| Tâche attribuée à quelqu'un | Seulement cette personne |

## Bon à savoir

- **Lave-vaisselle** : dans l'onglet Vaisselle, « Qui fait quoi » définit qui remplit et lance, et qui vide. N'importe qui peut quand même appuyer sur le bouton pour dépanner, et l'historique montre qui a fait quoi. Si aucun rôle n'est choisi, tout le monde est prévenu.
- **Tâches répétées** : en cochant, la tâche revient automatiquement au jour/semaine/mois suivant et garde « Dernière fois : … ».
- **Ménage automatique** : les réservations de plus de 7 jours, les tâches faites depuis plus de 30 jours et l'historique du lave-vaisselle de plus de 90 jours sont effacés.
- **Quotas gratuits** largement suffisants pour une famille (Cloudflare : 100 000 requêtes et 1 000 écritures KV par jour ; Firestore : 50 000 lectures par jour).
- **Sécurité** : l'app n'a pas de mot de passe ; ne partage le lien qu'avec la famille. La clé privée VAPID ne va que dans Cloudflare, jamais dans `config.js`.
- **Mise à jour** : modifie les fichiers sur GitHub, les téléphones prennent la nouvelle version à la prochaine ouverture.
