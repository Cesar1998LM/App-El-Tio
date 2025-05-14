// auth.js

// --- Configuración de Firebase ---
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- Usuarios en código ---
const users = [
  { user: 'admin', pass: 'michel123' },
  { user: 'vendedor', pass: 'venta2025' }
  // Agrega aquí nuevos usuarios en el mismo formato
];

let currentUser = null;
let ventasDia = 0;
let historialTickets = [];

// --- Elementos DOM de login ---
const loginScreen = document.getElementById('login-screen');
const app       = document.getElementById('app');
const userInput = document.getElementById('user-input');
const passInput = document.getElementById('pass-input');
const loginBtn  = document.getElementById('login-btn');
const loginError= document.getElementById('login-error');

// --- Manejo de sesión ---
loginBtn.onclick = () => {
  const u = userInput.value.trim();
  const p = passInput.value;
  if (users.find(x => x.user===u && x.pass===p)) {
    currentUser = u;
    loginScreen.classList.add('hidden');
    app.classList.remove('hidden');
    initRealtime();
  } else {
    loginError.style.visibility = 'visible';
  }
};

// --- Forzar logout (no session persist) ---
function forceLogout() {
  currentUser = null;
  app.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  userInput.value = '';
  passInput.value = '';
}

// --- Realtime Database refs ---
const salesRef   = db.ref('ventas');
const ticketsRef = db.ref('historialTickets');

// --- Inicialización de escucha en tiempo real ---
function initRealtime() {
  // Ventas acumuladas
  salesRef.on('value', snap => {
    ventasDia = snap.val() || 0;
    document.getElementById('ventas-dia').textContent = ventasDia.toFixed(2);
  });
  // Historial de tickets
  ticketsRef.on('value', snap => {
    historialTickets = Object.values(snap.val() || {});
  });
}

// --- Función auxiliar para enviar a Firebase ---
function pushToFirebase() {
  salesRef.set(ventasDia);
  ticketsRef.set(historialTickets);
}

// --- Ejemplo de uso en tu genBtn.onclick ---
// genBtn.onclick = () => {
//   /* ... tu lógica de generación de ticket ... */
//   historialTickets.push({ contenido: txt, total: ventasDia, fecha: new Date().toLocaleString() });
//   ventasDia += parseFloat(/* total actual */);
//   pushToFirebase();
// };

// --- Borrar datos al cerrar día --- 
document.getElementById('clear-day').onclick = () => {
  // aquí puedes imprimir el resumen, luego:
  salesRef.remove();
  ticketsRef.remove();
  forceLogout(); // opcional: vuelve al login
};
