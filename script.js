const seleccion = {
    tamano: null,
    bases: [],
    vegetales: [],
    salsas: [],
    proteinas: []
};

// Seleccionar todos los botones de opciones
document.querySelectorAll(".list-group-item").forEach(button => {
    button.addEventListener("click", function () {
        const group = this.dataset.group; // Obtiene el tipo de grupo

        if (group === "tamano") {
            document.querySelectorAll(`[data-group="tamano"]`).forEach(btn => btn.classList.remove("selected"));
            seleccion.tamano = this.textContent;
            this.classList.add("selected");
        } else if (group === "base") {
            toggleSelection(this, seleccion.bases, 1);
        } else if (group === "vegetale") {
            toggleSelection(this, seleccion.vegetales, 4);
        } else if (group === "salsa") {
            toggleSelection(this, seleccion.salsas, 3);
        } else if (group === "proteina") {
            toggleSelection(this, seleccion.proteinas, 1);
        } 

        actualizarResumen();
    });
});

// Función para manejar la selección con límites
function toggleSelection(button, array, max) {
    const item = button.textContent;
    const index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1); // Quitar si ya está seleccionado
        button.classList.remove("selected");
    } else if (array.length < max) {
        array.push(item);
        button.classList.add("selected");
    }
}

// Función para actualizar el resumen del carrito
function actualizarResumen() {
    document.getElementById("resumenTamano").textContent = seleccion.tamano || "Ninguno";
    document.getElementById("resumenBase").textContent = seleccion.bases.length ? seleccion.bases.join(", ") : "Ninguna";
    document.getElementById("resumenVegetal").textContent = seleccion.vegetales.length ? seleccion.vegetales.join(", ") : "Ninguno";
    document.getElementById("resumenSalsa").textContent = seleccion.salsas.length ? seleccion.salsas.join(", ") : "Ninguna";
    document.getElementById("resumenProteina").textContent = seleccion.proteinas.length ? seleccion.proteinas.join(", ") : "Ninguna";

    if (seleccion.tamano || seleccion.bases.length || seleccion.vegetales.length || seleccion.salsas.length || seleccion.proteinas.length) {
        document.getElementById("btn-carrito").style.display = "block";
    }
}

// Función para abrir y cerrar el carrito
function toggleCarrito() {
    const carrito = document.getElementById("carrito");
    carrito.style.display = (carrito.style.display === "block") ? "none" : "block";
}

// Agregar otro bowl
document.getElementById("btn-agregar-bowl").addEventListener("click", function () {
    if (!seleccion.tamano || seleccion.bases.length === 0) {
        alert("Por favor, selecciona al menos un tamaño y una base antes de agregar el bowl.");
        return;
    }

    const resumenBowl = ` ${seleccion.tamano} |  ${seleccion.bases.join(", ")} |  ${seleccion.vegetales.length ? seleccion.vegetales.join(", ") : "Sin vegetales"} |  ${seleccion.salsas.length ? seleccion.salsas.join(", ") : "Sin salsas"} | ${seleccion.proteinas.length ? seleccion.proteinas.join(", ") : "Sin proteína"}`;
    
    const li = document.createElement("li");
    li.textContent = resumenBowl;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.onclick = () => li.remove();

    li.appendChild(btnEliminar);
    document.getElementById("listaResumenBowl").appendChild(li);

    // Limpiar selección actual
    seleccion.tamano = null;
    seleccion.bases = [];
    seleccion.vegetales = [];
    seleccion.salsas = [];
    seleccion.proteinas = [];

    // Quitar clases seleccionadas
    document.querySelectorAll(".list-group-item").forEach(btn => btn.classList.remove("selected"));

    actualizarResumen();
});

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    const nombreCliente = document.getElementById("nombreCliente").value.trim() || "No indicado";

    // Validar que el nombre no esté vacío
    if (!nombreCliente) {
        alert("Por favor, ingresa tu nombre antes de enviar el pedido.");
        return;
    }

    const lista = document.querySelectorAll("#listaResumenBowl li");
    if (lista.length === 0) {
        alert("Agrega al menos un bowl antes de enviar el pedido.");
        return;
    }

    let mensaje = `Hola, mi nombre es *${nombreCliente}* y quiero pedir los siguientes bowls:%0A%0A`;

    lista.forEach((li, index) => {
        // Separamos los datos individuales del texto del bowl
        const partes = li.textContent.replace("", "").trim().split("|").map(p => p.trim());
        mensaje += `🍲 *Bowl ${index + 1}:*%0A`;
        mensaje += `*• Tamaño:* ${partes[0]}%0A`;
        mensaje += `*• Base:* ${partes[1]}%0A`;
        mensaje += `*• Vegetales:* ${partes[2] || "Sin vegetales"}%0A`;
        mensaje += `*• Proteína:* ${partes[4] || "Sin proteína"}%0A`;
        mensaje += `*• Salsas:* ${partes[3] || "Sin salsas"}%0A%0A`;
    });

    const url = `https://wa.me/56942956716?text=${mensaje}`;
    window.open(url, "_blank");
}

function checkAccessTime() {
  const now = new Date();
  const currentHour = now.getHours();

  // Definimos el horario bloqueado: entre las 12:00 (12) y 21:00 (21, sin incluir)
  const isBlocked = currentHour >= 12 && currentHour < 21;

  const overlay = document.getElementById('overlay-block-time');
  if (isBlocked) {
    overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }
}

// Ejecutar al cargar la página
checkAccessTime();

// Opcional: volver a verificar cada minuto
setInterval(checkAccessTime, 60 * 1000);

