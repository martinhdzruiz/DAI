console.log("🔎 busqueda.js cargado");

const input = document.getElementById("buscador");
const contador = document.getElementById("contador");
const resultados = document.getElementById("resultados");
const mensajeInfo = document.getElementById("mensaje-info");
const loader = document.getElementById("loader");

if (input) {
    input.addEventListener("input", async () => {
        const texto = input.value.trim();

        // Si menos de 3 caracteres: no buscamos
        if (texto.length < 3) {
            resultados.innerHTML = "";
            contador.classList.add("hidden");
            loader.classList.add("hidden");
            mensajeInfo.textContent = "Escribe al menos 3 caracteres para iniciar la búsqueda.";
            mensajeInfo.classList.remove("hidden");
            return;
        }

        // Preparar UI mientras busca
        mensajeInfo.classList.add("hidden");
        loader.classList.remove("hidden");
        contador.classList.add("hidden");
        resultados.innerHTML = "";

        try {
            const res = await fetch(`/api/productos/busqueda-anticipada/${encodeURIComponent(texto)}`);
            const datos = await res.json();

            loader.classList.add("hidden");
            contador.classList.remove("hidden");
            contador.textContent = `${datos.length} productos encontrados`;

            if (!Array.isArray(datos) || datos.length === 0) {
                resultados.innerHTML = "";
                mensajeInfo.textContent = "No se encontraron productos para esa búsqueda.";
                mensajeInfo.classList.remove("hidden");
                return;
            }

            // Renderizar resultados usando TUS product-card
            resultados.innerHTML = datos
                .map(p => `
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
                `)
                .join("");

        } catch (err) {
            console.error("❌ Error en la búsqueda anticipada:", err);
            loader.classList.add("hidden");
            mensajeInfo.textContent = "Ha ocurrido un error al buscar productos.";
            mensajeInfo.classList.remove("hidden");
        }
    });
}
