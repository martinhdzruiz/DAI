console.log("🔎 busqueda.js ACTIVO (búsqueda desde 1 letra + título dinámico)");

const input = document.getElementById("buscador");
const zona = document.getElementById("contenido-dinamico");
const titulo = document.getElementById("titulo-busqueda");

if (!input || !zona) {
    console.warn("⛔ No hay buscador o zona dinámica en esta página.");
} else {

    let contenidoOriginal = zona.innerHTML;
    let tituloOriginal = titulo ? titulo.textContent : "";

    // 👉 1. ENTER NO navega
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

    // 👉 2. Búsqueda anticipada desde 1 letra
    input.addEventListener("input", async () => {
        const texto = input.value.trim();

        // Si está vacío → restaurar el contenido original
        if (texto.length === 0) {
            zona.innerHTML = contenidoOriginal;
            if (titulo) titulo.textContent = tituloOriginal;
            return;
        }

        try {
            const res = await fetch(`/api/productos/busqueda-anticipada/${encodeURIComponent(texto)}`);
            const productos = await res.json();

            // 👉 Actualizar el título dinámico
            if (titulo) titulo.textContent = `Resultados para: "${texto}"`;

            // 👉 Sin resultados
            if (!productos.length) {
                zona.innerHTML = `<p>No se encontraron productos.</p>`;
                return;
            }

            // 👉 Mostrar resultados
            zona.innerHTML = `
                <h3>${productos.length} productos encontrados</h3>
                <div class="product-grid">
                ${productos.map(p => `
                    <div class="product-card" onclick="location.href='/producto/${p._id}'">
                        <img src="${p.url_img}" alt="${p.texto_1}">

                        <p class="product-card__name">${p.texto_1}</p>
                        <p class="product-card__subtitle">${p.texto_2}</p>

                        <div class="precio">
                            ${
                                p.precio_rebajado > 0
                                    ? `
                                        <span class="product-card__price-old">${p.precio_euros} €</span>
                                        <span class="precio-valor">${p.precio_rebajado} €</span>
                                      `
                                    : `
                                        <span class="precio-valor">${p.precio_euros} €</span>
                                        <span class="precio-unidad">${p.unidad_medida}</span>
                                      `
                            }
                        </div>

                        <div class="btn--cart">Añadir al carrito</div>
                    </div>
                `).join("")}
                </div>
            `;

        } catch (err) {
            console.error("❌ Error en búsqueda:", err);
        }
    });
}
