// Réglages de l'app Maison — c'est le seul fichier à modifier.
// Tant que "firebase" vaut null, l'app tourne en MODE DÉMO (données sur ce téléphone uniquement).
window.MAISON_CONFIG = {
  // 1) Colle ici l'objet firebaseConfig de ta console Firebase (Paramètres du projet > Vos applications > Web)
  firebase: null,
  // firebase: {
  //   apiKey: "...",
  //   authDomain: "...firebaseapp.com",
  //   projectId: "...",
  //   storageBucket: "...",
  //   messagingSenderId: "...",
  //   appId: "..."
  // },

  // Nom du foyer (permet d'utiliser le même projet Firebase pour autre chose)
  famille: "maison",

  // 2) Notifications : adresse de ton Cloudflare Worker + clés générées avec cles.html
  pushServer: "",   // ex. "https://maison-push.ton-compte.workers.dev"
  pushKey: "",      // FAMILY_KEY (la même que dans le Worker)
  vapidPublic: ""   // VAPID_PUBLIC (la même que dans le Worker)
};
