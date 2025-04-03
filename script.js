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
        } else if (group === "vegetale") {  // El HTML tiene "vegetale", así que uso esta clave
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

    // Mostrar el botón de carrito si hay productos seleccionados
    if (seleccion.tamano || seleccion.bases.length || seleccion.vegetales.length || seleccion.salsas.length) {
        document.getElementById("btn-carrito").style.display = "block";
    }
}

// Función para abrir y cerrar el carrito
function toggleCarrito() {
    const carrito = document.getElementById("carrito");
    carrito.style.display = (carrito.style.display === "block") ? "none" : "block";
}

// Evento para cerrar el carrito
document.getElementById("btn-cerrar-carrito").addEventListener("click", function () {
    document.getElementById("carrito").style.display = "none";
});
