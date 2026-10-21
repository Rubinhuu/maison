// Réglages de l'app Maison — c'est le seul fichier à modifier.
// Tant que "firebase" vaut null, l'app tourne en MODE DÉMO (données sur ce téléphone uniquement).
window.MAISON_CONFIG = {
  // 1) Colle ici l'objet firebaseConfig de ta console Firebase (Paramètres du projet > Vos applications > Web)
  firebase: {
    apiKey: "AIzaSyA3PE2qlJvpw6JmUQtKk-vxXc_Bc2EIioI",
    authDomain: "maison-69db7.firebaseapp.com",
    projectId: "maison-69db7",
    storageBucket: "maison-69db7.firebasestorage.app",
    messagingSenderId: "329850590487",
    appId: "1:329850590487:web:6d7cf822344009f5991352"
  },

  // Nom du foyer (permet d'utiliser le même projet Firebase pour autre chose)
  famille: "maison",

  // 2) Notifications : adresse de ton Cloudflare Worker + clés générées avec cles.html
  pushServer: "https://maison-push.r-s-antunes-10-08.workers.dev/",
  pushKey: "A2uXoyFdoVtajeUgcvOcdmdffvLG4zYn",
  vapidPublic: "BPE38c0tVL6-bMulw_xewv8xgeUADydDXLiHM4aUQ4QhpYWAZF89pXw3_3b3fX-Y_XIrcpNfZd4TOS9oaXmeh0A"
};
