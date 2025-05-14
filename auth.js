// auth.js
const usuarios = [
  { usuario: 'Javier', clave: '12345' }
];

let usuarioActivo = null;

function iniciarSesion(usuario, clave) {
  const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.clave === clave);
  if (usuarioEncontrado) {
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
    usuarioActivo = usuarioEncontrado;
    mostrarApp();
  } else {
    alert('Usuario o clave incorrectos');
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  usuarioActivo = null;
  mostrarLogin();
}

function obtenerUsuarioActivo() {
  const usuarioGuardado = localStorage.getItem('usuarioActivo');
  if (usuarioGuardado) {
    usuarioActivo = JSON.parse(usuarioGuardado);
    mostrarApp();
  } else {
    mostrarLogin();
  }
}

function mostrarLogin() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

function mostrarApp() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('usuario-actual').innerText = usuarioActivo.usuario;
  // Aquí también puedes guardar el carrito en el localStorage si quieres mantenerlo entre sesiones
}

document.getElementById('btn-login').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value;
  const clave = document.getElementById('clave').value;
  iniciarSesion(usuario, clave);
});

document.getElementById('btn-logout').addEventListener('click', cerrarSesion);

// Llamar al obtenerUsuarioActivo al cargar la página
obtenerUsuarioActivo();
