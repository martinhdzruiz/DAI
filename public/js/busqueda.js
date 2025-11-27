console.log("🔎 busqueda.js cargado");

const input = document.getElementById("buscador");
const contador = document.getElementById("contador");
const resultados = document.getElementById("resultados");

input.addEventListener("input", async () => {
    const texto = input.value.trim();

    // Si tiene menos de 3 caracteres, limpiamos y no buscamos
    if (texto.length < 3) {
        contador.textContent = "";
        resultados.innerHTML = "";
        return;
    }

    // Llamada al servidor
    const res = await fetch(`/api/productos/busqueda-anticipada/${texto}`);
    const datos = await res.json();

    contador.textContent = `${datos.length} productos encontrados`;

  
    resultados.innerHTML = datos
    .map(p => `
        <div class="product-card" onclick="location.href='/producto/${p._id}'">
            
            <img src="${p.url_img}" alt="${p.texto_1}">

            <div>
                <p class="product-card__name">${p.texto_1}</p>
                <p class="product-card__subtitle">${p.texto_2}</p>
            </div>

            <div class="precio">
                ${
                    p.precio_rebajado > 0
                        ? `
                            <span class="product-card__price-old">${p.precio_euros} €</span>
                            <span class="precio-valor text-danger">${p.precio_rebajado} €</span>
                        `
                        : `
                            <span class="precio-valor">${p.precio_euros} €</span>
                            <span class="precio-unidad">${p.unidad_medida}</span>
                        `
                }
            </div>

            <button class="btn--cart mt-2">Añadir al carrito</button>
        </div>
    `)
    .join("");


});
