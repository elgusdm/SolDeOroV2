document.addEventListener('DOMContentLoaded', function () {

    const productos = document.querySelectorAll('.btn-agregar');
    const carritoItems = document.getElementById('carrito-items');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoTotal = document.getElementById('carrito-total');
    const totalPrecio = document.getElementById('total-precio');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnPagar = document.getElementById('btn-pagar');
    const contadorCarrito = document.getElementById('contador-carrito');
    const menuMovil = document.querySelector('.menu-movil');
    const menu = document.querySelector('.menu');
    const formularioContacto = document.getElementById('formulario-contacto');


    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


    actualizarCarrito();


    productos.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });

    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    if (btnPagar) {
        btnPagar.addEventListener('click', procesarPago);
    }

    menuMovil.addEventListener('click', toggleMenu);

    if (formularioContacto) {
        formularioContacto.addEventListener('submit', enviarFormulario);
    }


    function agregarAlCarrito(e) {
        const boton = e.currentTarget;
        const id = boton.getAttribute('data-id');
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));


        const existeItem = carrito.find(item => item.id === id);

        if (existeItem) {

            existeItem.cantidad++;
        } else {

            carrito.push({
                id,
                nombre,
                precio,
                cantidad: 1
            });
        }


        guardarCarrito();
        actualizarCarrito();
        mostrarNotificacion(`${nombre} agregado al carrito`, 'exito');
    }

    function actualizarCarrito() {

        if (!carritoItems || !contadorCarrito) return;


        carritoItems.innerHTML = '';


        contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);


        if (carrito.length === 0) {
            if (carritoVacio) carritoVacio.style.display = 'block';
            if (carritoTotal) carritoTotal.style.display = 'none';
        } else {
            if (carritoVacio) carritoVacio.style.display = 'none';
            if (carritoTotal) carritoTotal.style.display = 'block';


            carrito.forEach(item => {
                const itemHTML = document.createElement('div');
                itemHTML.classList.add('carrito-item');
                itemHTML.innerHTML = `
                    <div class="carrito-item-info">
                        <div class="carrito-item-nombre">${item.nombre}</div>
                        <div class="carrito-item-precio">$${item.precio.toFixed(2)} MXN</div>
                    </div>
                    <div class="carrito-item-cantidad">
                        <button class="btn-cantidad" data-id="${item.id}" data-accion="restar">-</button>
                        <span class="cantidad-valor">${item.cantidad}</span>
                        <button class="btn-cantidad" data-id="${item.id}" data-accion="sumar">+</button>
                    </div>
                    <button class="btn-eliminar" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;

                carritoItems.appendChild(itemHTML);
            });


            document.querySelectorAll('.btn-cantidad').forEach(btn => {
                btn.addEventListener('click', cambiarCantidad);
            });

            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', eliminarItem);
            });


            if (totalPrecio) {
                const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
                totalPrecio.textContent = `$${total.toFixed(2)} MXN`;
            }
        }
    }

    function cambiarCantidad(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const accion = e.currentTarget.getAttribute('data-accion');
        const item = carrito.find(item => item.id === id);

        if (accion === 'sumar') {
            item.cantidad++;
        } else if (accion === 'restar') {
            item.cantidad--;

            if (item.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== id);
            }
        }

        guardarCarrito();
        actualizarCarrito();
    }

    function eliminarItem(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const item = carrito.find(item => item.id === id);

        if (item) {
            carrito = carrito.filter(i => i.id !== id);
            guardarCarrito();
            actualizarCarrito();
            mostrarNotificacion(`${item.nombre} eliminado del carrito`, 'exito');
        }
    }

    function vaciarCarrito() {
        if (carrito.length === 0) return;

        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
            mostrarNotificacion('Carrito vaciado', 'exito');
        }
    }

    function procesarPago() {
        if (carrito.length === 0) {
            mostrarNotificacion('El carrito está vacío', 'error');
            return;
        }

        // Aquí iría la lógica de procesamiento de pago

        mostrarLoader(true);

        setTimeout(() => {
            mostrarLoader(false);
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
            mostrarNotificacion('¡Compra realizada con éxito!', 'exito');
        }, 2000);
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function toggleMenu() {
        menu.classList.toggle('activo');
    }

    function enviarFormulario(e) {
        e.preventDefault();


        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;


        if (!nombre || !email || !asunto || !mensaje) {
            mostrarNotificacion('Por favor completa todos los campos', 'error');
            return;
        }


        mostrarLoader(true);

        setTimeout(() => {
            mostrarLoader(false);
            formularioContacto.reset();
            mostrarNotificacion('Mensaje enviado correctamente', 'exito');
        }, 1500);
    }

    function mostrarNotificacion(mensaje, tipo) {

        const notificacionesExistentes = document.querySelectorAll('.notificacion');
        notificacionesExistentes.forEach(notif => notif.remove());


        const notificacion = document.createElement('div');
        notificacion.classList.add('notificacion', `notificacion-${tipo}`);
        notificacion.textContent = mensaje;

        document.body.appendChild(notificacion);


        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    function mostrarLoader(mostrar) {
        let loader = document.querySelector('.loader');

        if (!loader) {
            loader = document.createElement('div');
            loader.classList.add('loader');
            document.body.appendChild(loader);
        }

        loader.style.display = mostrar ? 'flex' : 'none';
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });


                if (menu.classList.contains('activo')) {
                    menu.classList.remove('activo');
                }
            }
        });
    });
});

