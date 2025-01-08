const API_URL = './productos.json';
let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Redirigir si no hay sesión
if (!localStorage.getItem('usuario') && document.title !== 'Inicio de Sesión - Mercado Libre') {
  window.location.href = 'login.html';
}

// Inicio de sesión
if (document.title === 'Inicio de Sesión - Mercado Libre') {
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    localStorage.setItem('usuario', usuario);
    window.location.href = 'index.html';  
}
);
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
  const notificacion = document.getElementById('notificacion');
  notificacion.textContent = mensaje;
  notificacion.classList.add('mostrar');
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
  }, 1900);
}

// Cargar productos desde JSON
async function cargarProductos() {
  const res = await fetch(API_URL);
  productos = await res.json();
  renderProductos();
}

// Renderizar productos
function renderProductos(filtro = '', buscar = '') {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos
    .filter(p => (filtro ? p.categoria === filtro : true) && p.nombre.toLowerCase().includes(buscar.toLowerCase()))
    .forEach(p => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.precio} USD</p>
        <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
      `;
      contenedor.appendChild(div);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(p => p.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarNotificacion(`Agregaste a tu carrito: ${producto.nombre}`);
}

// Renderizar carrito
function renderCarrito() {
  const contenedor = document.getElementById('carrito');
  contenedor.innerHTML = '';
  let total = 0;
  carrito.forEach(p => {
    total += p.precio * p.cantidad;
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.precio} USD</p>
      <div>
        <button onclick="actualizarCantidad(${p.id}, -1)">-</button>
        <span>${p.cantidad}</span>
        <button onclick="actualizarCantidad(${p.id}, 1)">+</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
  document.getElementById('total').textContent = `Total: ${total} USD`;
}

// Actualizar cantidad
function actualizarCantidad(id, cambio) {
  const producto = carrito.find(p => p.id === id);
  producto.cantidad += cambio;
  if (producto.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
}

// Finalizar compra
document.getElementById('finalizar-compra')?.addEventListener('click', () => {
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const usuario = localStorage.getItem('usuario');
  function mostrarMensaje() {
    const mensaje = document.getElementById('mensaje');
    mensaje.style.display = 'block'; // Muestra el mensaje
    setTimeout(() => {
        mensaje.style.display = 'none'; 
       
    }, 2000); 
}

mostrarMensaje("tnty")
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
 
});

// Filtrar productos
document.getElementById('filtro-categoria')?.addEventListener('change', e => {
  renderProductos(e.target.value, document.getElementById('buscar').value);
});

// Buscar productos
document.getElementById('buscar')?.addEventListener('input', e => {
  renderProductos(document.getElementById('filtro-categoria').value, e.target.value);
});

// Renderizar carrito en su página
if (document.getElementById('carrito')) renderCarrito();

// Cargar productos
if (document.getElementById('productos')) cargarProductos();