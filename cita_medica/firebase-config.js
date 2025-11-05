// Este archivo se puede crear separadamente o incluir en el HTML como arriba
// Para desarrollo, puedes crear un archivo firebase-config.js con:

const firebaseConfig = {
    apiKey: "AIzaSyBeUdqG_S3ADJzDZxPT4R8vzkx0uPWwWJw",
    authDomain: "citas-medicas-app-99f8f.firebaseapp.com",
    projectId: "citas-medicas-app-99f8f",
    storageBucket: "citas-medicas-app-99f8f.firebasestorage.app",
    messagingSenderId: "986968651357",
    appId: "1:986968651357:web:34625b2d15641759807fb4"
};


// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase inicializado correctamente");
} catch (error) {
    console.error("❌ Error inicializando Firebase:", error);
}

const db = firebase.firestore();
