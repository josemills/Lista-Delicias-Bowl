const seleccion = {
    tamano: null,
    bases: [],
    vegetales: [],
    salsas: []
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
            toggleSelection(this, seleccion.bases, 2);
        } else if (group === "vegetale") {
            toggleSelection(this, seleccion.vegetales, 4);
        } else if (group === "salsa") {
            toggleSelection(this, seleccion.salsas, 3);
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

    if (seleccion.tamano || seleccion.bases.length || seleccion.vegetales.length || seleccion.salsas.length) {
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

    const resumenBowl = `🥗 ${seleccion.tamano} | 🍚 ${seleccion.bases.join(", ")} | 🥦 ${seleccion.vegetales.join(", ") || "Sin vegetales"} | 🥫 ${seleccion.salsas.join(", ") || "Sin salsas"}`;
    
    const li = document.createElement("li");
    li.textContent = resumenBowl;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.onclick = () => li.remove();

    li.appendChild(btnEliminar);
    document.getElementById("listaResumenBowl").appendChild(li);

    // Limpiar selección actual
    seleccion.tamano = null;
    seleccion.bases = [];
    seleccion.vegetales = [];
    seleccion.salsas = [];

    // Quitar clases seleccionadas
    document.querySelectorAll(".list-group-item").forEach(btn => btn.classList.remove("selected"));

    actualizarResumen();
});

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    const nombreCliente = document.getElementById("nombreCliente").value.trim() || "No indicado";

    // Reunir todos los bowls listados
    const lista = document.querySelectorAll("#listaResumenBowl li");
    if (lista.length === 0) {
        alert("Agrega al menos un bowl antes de enviar el pedido.");
        return;
    }

    let mensaje = `Hola, mi nombre es *${nombreCliente}* y quiero pedir los siguientes bowls:\n\n`;
    lista.forEach((li, index) => {
        mensaje += `🍲 *Bowl ${index + 1}:* ${li.textContent.replace("❌", "").trim()}\n`;
    });

    const url = `https://wa.me/56978952735?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

// Botón de enviar WhatsApp
// Asegúrate de tener un botón con id="btn-enviar-wsp" en el HTML si deseas mantener esto
// O puedes llamar enviarPedidoWhatsApp directamente desde el HTML como ya haces
