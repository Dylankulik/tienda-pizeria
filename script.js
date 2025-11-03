document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const enviarBtn = document.getElementById('enviar-whatsapp-btn');
    const formulario = document.getElementById('formulario-pedido-modal');
    
    // Elementos del Modal Principal
    const botonFlotante = document.getElementById('boton-carrito-flotante');
    const contadorProductos = document.getElementById('contador-productos');
    const modal = document.getElementById('modal-carrito');

    // 🚨 Elementos del Modal de Empanadas
    const modalEmpanadas = document.getElementById('modal-empanadas');
    const docenasSelector = document.getElementById('docenas-selector');
    const totalUnidadesRequeridasSpan = document.getElementById('total-unidades-requeridas');
    const unidadesDistribuidasSpan = document.getElementById('unidades-distribuidas');
    const validacionUnidadesP = document.getElementById('validacion-unidades');
    const unidadInputsModal = document.querySelectorAll('.cantidad-unidad-empanada-modal');
    const selectCoccionModal = document.getElementById('select-coccion-modal');
    const agregarEmpanadasBtn = document.getElementById('agregar-empanadas-modal-btn');
    
    // Estado del Carrito y WhatsApp
    let carrito = {};
    const numerosWhatsApp = {
        'wilde': '5491153148925', // Nro de Wilde4
        'lanus': '5491153148925', // Nro de Lanús
        'gerli': '5491153148925' // Nro de Gerli
    };
 
    // --- FUNCIÓN PRINCIPAL DE RENDERIZADO Y CÁLCULO ---
    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;
        const itemsEnCarrito = Object.values(carrito).filter(item => item.cantidad > 0);

        itemsEnCarrito.forEach(item => {
            const precioTotalFormato = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.total);
            const li = document.createElement('li');
            li.classList.add('item-carrito');
            const cantidadDisplay = item.unidades_docena ? 
                `${item.cantidad} doc. (${item.unidades_docena} un. total)` : 
                `${item.cantidad} un.`;

            li.innerHTML = `
            <div class="item-info">
                <span class="item-nombre">${item.nombre}</span> 
                <span class="item-detalles">(${cantidadDisplay} x ${precioTotalFormato})</span>
            </div>
            <div class="item-controles">
                <button class="control-btn eliminar-item" data-nombre="${item.nombre}">X</button>
            </div>
            `;

            listaCarrito.appendChild(li);
            total += item.total;
        });

        if (itemsEnCarrito.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Aún no has agregado productos.';
            listaCarrito.appendChild(li);
        }

        totalCarrito.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
        contadorProductos.textContent = itemsEnCarrito.length; 
        enviarBtn.disabled = itemsEnCarrito.length === 0;

        configurarControlesCarrito(); 
    }

    // --- FUNCIÓN: MANEJAR LOS BOTONES DE ELIMINAR ---
    function configurarControlesCarrito() {
        document.querySelectorAll('.eliminar-item').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const nombre = event.target.getAttribute('data-nombre');
                delete carrito[nombre]; 
                actualizarCarrito();
            });
        });
    }

    // --- LÓGICA DE AGREGAR PRODUCTOS ESTÁNDAR ---
    document.querySelectorAll('.producto-card').forEach(card => {
        const nombreBase = card.getAttribute('data-nombre');
        const precio = parseFloat(card.getAttribute('data-precio'));
        
        const agregarBtn = card.querySelector('.agregar-btn');
        const abrirSaboresBtn = card.querySelector('.btn-abrir-sabores');
        const cantidadInput = card.querySelector('.cantidad'); 

        // Lógica para abrir el modal de empanadas
        if (abrirSaboresBtn) {
            abrirSaboresBtn.addEventListener('click', () => {
                docenasSelector.value = '1';
                selectCoccionModal.value = '';
                unidadInputsModal.forEach(input => input.value = '0');
                actualizarTotalUnidadesModal();
                modalEmpanadas.style.display = 'block';
            });
        }
        
        // Lógica estándar de agregar 
        if (agregarBtn && !abrirSaboresBtn) {
            agregarBtn.addEventListener('click', () => {
                const cantidad = parseInt(cantidadInput.value);
                
                if (cantidad >= 1) {
                    const nombreProducto = nombreBase;
                    if (!carrito[nombreProducto]) {
                        carrito[nombreProducto] = { 
                            nombre: nombreProducto, cantidad: 0, precio: precio, total: 0,
                            unidades_docena: null, detalle_gustos: null
                        };
                    }
                    
                    carrito[nombreProducto].cantidad += cantidad; 
                    carrito[nombreProducto].total = carrito[nombreProducto].cantidad * precio;
                    actualizarCarrito();
                    cantidadInput.value = '1';
                }
            });
        }
    });

    // --- LÓGICA DEL MODAL DE EMPANADAS ---

    /**
     * Valida si las unidades seleccionadas son múltiplo de 12 y si la cocción está elegida.
     * @returns {Object} Datos del estado actual del modal.
     */
    function actualizarTotalUnidadesModal() {
        const docenas = parseInt(docenasSelector.value);
        const unidadesRequeridas = docenas * 12;
        
        let unidadesDistribuidas = 0;
        let detalleGustos = {};

        unidadInputsModal.forEach(input => {
            const unidades = parseInt(input.value) || 0;
            unidadesDistribuidas += unidades;
            if (unidades > 0) {
                detalleGustos[input.getAttribute('data-gusto')] = unidades;
            }
        });

        totalUnidadesRequeridasSpan.textContent = unidadesRequeridas;
        unidadesDistribuidasSpan.textContent = unidadesDistribuidas;

        // 2. Validación de Múltiplo de 12 y Cocción
        const coccionSeleccionada = selectCoccionModal.value;
        const estaCompleto = unidadesDistribuidas === unidadesRequeridas;
        const coccionValida = coccionSeleccionada !== "";
        
        agregarEmpanadasBtn.textContent = `Añadir al Carrito (${docenas} Docenas)`;

        // --- Mensajes de Validación ---
        if (unidadesDistribuidas === 0) {
            validacionUnidadesP.textContent = `Selecciona las unidades (deben sumar ${unidadesRequeridas}).`;
            validacionUnidadesP.style.color = "var(--color-principal)";
            agregarEmpanadasBtn.disabled = true;
        } else if (!coccionValida) {
            validacionUnidadesP.textContent = "¡Distribución pendiente! Falta seleccionar la cocción.";
            validacionUnidadesP.style.color = "var(--color-enfasis)";
            agregarEmpanadasBtn.disabled = true;
        } else if (unidadesDistribuidas !== unidadesRequeridas) {
             const diferencia = unidadesRequeridas - unidadesDistribuidas;
             if (diferencia > 0) {
                validacionUnidadesP.textContent = `Faltan ${diferencia} unidades por distribuir.`;
             } else {
                validacionUnidadesP.textContent = `¡Te pasaste por ${-diferencia} unidades!`;
             }
            validacionUnidadesP.style.color = "var(--color-principal)";
            agregarEmpanadasBtn.disabled = true;
        } else if (estaCompleto && coccionValida) {
            validacionUnidadesP.textContent = `✅ ¡Todo listo! Se agregarán ${docenas} docenas.`;
            validacionUnidadesP.style.color = "var(--color-verde-albahaca)";
            agregarEmpanadasBtn.disabled = false;
        }

        return { docenas, unidadesRequeridas, detalleGustos, coccionSeleccionada };
    }

    // 3. Listeners para el modal de empanadas (cambio de docenas y unidades)
    docenasSelector.addEventListener('change', actualizarTotalUnidadesModal);
    selectCoccionModal.addEventListener('change', actualizarTotalUnidadesModal);
    unidadInputsModal.forEach(input => {
        input.addEventListener('input', () => {
            if (parseInt(input.value) < 0) input.value = '0';
            actualizarTotalUnidadesModal();
        });
    });
    
    // 4. Botón de Añadir al Carrito (desde el modal)
    agregarEmpanadasBtn.addEventListener('click', () => {
        const { docenas, unidadesRequeridas, detalleGustos, coccionSeleccionada } = actualizarTotalUnidadesModal();
        
        if (agregarEmpanadasBtn.disabled) {
             return; 
        }

        const empanadaCard = document.querySelector('.empanadas-card');
        const nombreBase = empanadaCard.getAttribute('data-nombre');
        const precioDocena = parseFloat(empanadaCard.getAttribute('data-precio'));
        
        const gustosStr = Object.keys(detalleGustos).map(g => `${detalleGustos[g]} ${g}`).join(', ');
        const nombreProducto = `${nombreBase} (${coccionSeleccionada}) [${gustosStr}]`;
        
        if (!carrito[nombreProducto]) {
            carrito[nombreProducto] = { 
                nombre: nombreProducto,
                cantidad: docenas, 
                precio: precioDocena, 
                total: docenas * precioDocena,
                unidades_docena: unidadesRequeridas, 
                detalle_gustos: detalleGustos 
            };
        } else {
            carrito[nombreProducto].cantidad = docenas;
            carrito[nombreProducto].total = docenas * precioDocena;
            carrito[nombreProducto].unidades_docena = unidadesRequeridas; 
            carrito[nombreProducto].detalle_gustos = detalleGustos;
        }
        
        modalEmpanadas.style.display = 'none';
        actualizarCarrito();
    });

    // --- MANEJO DE CIERRE DE MODALES ---
    const cerrarModalBtns = document.querySelectorAll('.cerrar-modal, .cerrar-modal-empanadas');
    cerrarModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            modalEmpanadas.style.display = 'none';
        });
    });
    
    botonFlotante.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === modalEmpanadas) {
            modalEmpanadas.style.display = 'none';
        }
    });

    // --- LÓGICA DE ENVÍO POR WHATSAPP (100% JS) ---
    const localSelector = document.getElementById('local-selector');
    
    formulario.addEventListener('submit', (e) => {
        // 🚨 Impedimos el envío del formulario al servidor
        e.preventDefault(); 
        
        // 1. VALIDACIÓN
        if (localSelector.value === "") {
            alert("Por favor, selecciona el local al que deseas enviar el pedido.");
            return;
        }

        // 2. OBTENCIÓN DE DATOS DEL CLIENTE
        const localElegido = localSelector.value;
        const numeroWhatsApp = numerosWhatsApp[localElegido];
        const nombreCliente = document.getElementById('nombre-cliente').value;
        const telefonoCliente = document.getElementById('telefono-cliente').value;
        const direccionCliente = document.getElementById('direccion-cliente').value;
        const metodoPago = document.getElementById('metodo-pago').value;

        // 3. CONSTRUCCIÓN DEL DETALLE DEL PEDIDO
        let totalFinal = 0;
        let detallePedido = '';

        for (const nombre in carrito) {
            const item = carrito[nombre];
            if (item.cantidad > 0) {
                totalFinal += item.total;
                
                const precioItemFormato = new Intl.NumberFormat('es-AR').format(item.total);

                if (item.unidades_docena) {
                    let detalleUnidades = '';
                    for (const gusto in item.detalle_gustos) {
                        detalleUnidades += `${item.detalle_gustos[gusto]} ${gusto}, `;
                    }
                    detalleUnidades = detalleUnidades.slice(0, -2); 

                    detallePedido += `* ${nombre}\n`;
                    detallePedido += `  - Cantidad: ${item.cantidad} docenas (${item.unidades_docena} un. total)\n`;
                    detallePedido += `  - Detalle Sabores: ${detalleUnidades}\n`;
                    detallePedido += `  - Subtotal: $${precioItemFormato}\n`;

                } else {
                    detallePedido += `* ${item.cantidad} unidades de ${nombre} = $${precioItemFormato}\n`;
                }
            }
        }
        
        // 4. MENSAJE FINAL COMPLETO
        const mensajeCompleto = `
¡Hola! 🍕 Tengo un pedido para el local de *${localElegido.toUpperCase()}*.

*DATOS DEL CLIENTE:*
Nombre: ${nombreCliente}
Teléfono: ${telefonoCliente}
Dirección: ${direccionCliente}
Método de Pago: ${metodoPago}

---
*DETALLE DEL PEDIDO:*
${detallePedido}
---
*TOTAL FINAL: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalFinal)}*
`;
        
        // 5. REDIRECCIÓN A WHATSAPP
        const mensajeCodificado = encodeURIComponent(mensajeCompleto);
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

        window.open(urlWhatsApp, '_blank');
        
        modal.style.display = 'none';
    });


    // --- LÓGICA DE FILTRADO ---
    const seccionesCatalogo = document.querySelectorAll('.catalogo');
    const mainContent = document.querySelector('main');
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    
    const tituloFiltro = document.createElement('h2');
    tituloFiltro.id = 'titulo-filtro-activo';
    mainContent.prepend(tituloFiltro);

    const nombresFiltro = {
        'todo': '', 
        'pizzas': '🍕 Pizzas',
        'combo': '🤝 Combos Especiales',
        'empanadas': '🥟 Empanadas',
        'bebidas': '🥤 Bebidas'
    };

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            const filtro = boton.getAttribute('data-filtro');

            botonesFiltro.forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');

            seccionesCatalogo.forEach(seccion => {
                const idSeccion = seccion.getAttribute('id');

                if (filtro === 'todo' || idSeccion === filtro) {
                    seccion.style.display = 'block';
                } else {
                    seccion.style.display = 'none';
                }
            });

            tituloFiltro.textContent = nombresFiltro[filtro];
            tituloFiltro.style.display = (filtro === 'todo') ? 'none' : 'block';
        });
    });

    // Iniciar en el filtro "TODO"
    const botonTodos = document.querySelector('.filtro-btn[data-filtro="todo"]');
    if (botonTodos) {
        botonTodos.click();
    }

    actualizarCarrito();
});
