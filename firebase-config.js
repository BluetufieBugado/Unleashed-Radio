/*
  FIREBASE-CONFIG.JS
  ===================
  Cole aqui os valores que o Firebase te deu (Configurações do projeto >
  Seus apps > ícone Web). Troque cada "COLOQUE_AQUI" pelo valor real.

  Isso é o que conecta seu site ao banco de dados que guarda a contagem
  de pessoas online.
*/

const firebaseConfig = {
  apiKey: "AIzaSyBdXk76jGbHXq1PPT07uoyJI8moAHwBDMI",
  authDomain: "unleashedradio.firebaseapp.com",
  databaseURL: "https://unleashedradio-default-rtdb.firebaseio.com",
  projectId: "unleashedradio",
  storageBucket: "unleashedradio.firebasestorage.app",
  messagingSenderId: "753982074352",
  appId: "1:753982074352:web:fc194bef3410c27f9d8135"
};

firebase.initializeApp(firebaseConfig);
