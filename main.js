// Fundainil: interacciones mínimas

// Correo que recibe los mensajes del formulario (cambiar por el real)
const CORREO_DESTINO = 'correo@fundainil.org';

// Menú en teléfono
const botonMenu = document.querySelector('.menu-boton');
const menu = document.getElementById('menu');

botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  botonMenu.setAttribute('aria-expanded', String(abierto));
  botonMenu.textContent = abierto ? 'Cerrar' : 'Menú';
});

menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.textContent = 'Menú';
  }
});

// Curvas de la portada: se dibujan una sola vez al cargar
const relieve = document.querySelector('.portada__relieve');
if (relieve && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  relieve.querySelectorAll('path').forEach((p, i) => {
    p.style.animationDelay = `${i * 0.06}s`;
  });
  relieve.classList.add('dibujar');
}

// Los enlaces de "Súmate" eligen el motivo en el formulario
const motivo = document.getElementById('motivo');
document.querySelectorAll('[data-motivo]').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    motivo.value = enlace.dataset.motivo;
  });
});

// Formulario: valida y abre el correo con el mensaje listo
const formulario = document.getElementById('formulario');
const aviso = document.getElementById('aviso');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = ['nombre', 'correo', 'mensaje'].map((id) => document.getElementById(id));
  let primeroInvalido = null;

  campos.forEach((campo) => {
    const valido = campo.checkValidity() && campo.value.trim() !== '';
    campo.setAttribute('aria-invalid', String(!valido));
    if (!valido && !primeroInvalido) primeroInvalido = campo;
  });

  if (primeroInvalido) {
    aviso.className = 'formulario__aviso error';
    aviso.textContent = primeroInvalido.id === 'correo'
      ? 'Revisa el correo: debe tener la forma nombre@dominio.com.'
      : 'Completa tu nombre, tu correo y el mensaje para enviarlo.';
    primeroInvalido.focus();
    return;
  }

  const datos = new FormData(formulario);
  const asunto = `${datos.get('motivo')}: ${datos.get('nombre')}`;
  const cuerpo = `${datos.get('mensaje')}\n\n${datos.get('nombre')}\n${datos.get('correo')}`;
  window.location.href = `mailto:${CORREO_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  aviso.className = 'formulario__aviso';
  aviso.textContent = 'Abrimos tu aplicación de correo con el mensaje listo. Solo falta enviarlo.';
});

document.getElementById('anio').textContent = new Date().getFullYear();
