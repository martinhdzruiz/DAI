// public/js/cambio-precio.js

const cambiar_precio = (evt) => {
    const boton = evt.target;
    const id = boton.dataset.id;

    // DEBUG EN CLIENTE
    console.log("➡ ID que envío al API:", id, "len:", id.length);

    const input = document.querySelector(`input[data-id="${id}"]`);
    const valor = parseFloat(input.value);

    const mensaje = boton.parentElement.querySelector(".mensaje");

    fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({ precio_euros: valor })
    })
    .then(res => res.json())
    .then(res => {
        console.log("⬅ Respuesta API:", res);

        if (res.error) {
            mensaje.textContent = "❌ " + res.error;
            mensaje.style.color = "red";
        } else {
            mensaje.textContent = "✔ Precio actualizado";
            mensaje.style.color = "green";
            if (typeof res.precio_euros !== "undefined") {
                input.value = res.precio_euros;
            }
        }
    })
    .catch(err => {
        console.error("❌ Error fetch:", err);
        mensaje.textContent = "❌ Error de conexión";
        mensaje.style.color = "red";
    });
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ cambio-precio.js cargado");

    const botones = document.querySelectorAll(".btn-cambiar-precio");
    for (const boton of botones) {
        boton.addEventListener("click", cambiar_precio);
    }
});
