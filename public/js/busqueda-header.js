console.log("🔎 busqueda-header.js cargado");

const input = document.getElementById("buscador-main");
const caja = document.getElementById("busqueda-anticipada");

if (input) {
    input.addEventListener("input", async () => {
        const texto = input.value.trim();

        // Ocultar si hay menos de 3 caracteres
        if (texto.length < 3) {
            caja.classList.add("hidden");
            caja.innerHTML = "";
            return;
        }

        // Llamada al endpoint correcto
        const res = await fetch(`/api/productos/busqueda-anticipada/${texto}`);
        const datos = await res.json();

        // Sin resultados
        if (datos.length === 0) {
            caja.innerHTML = `<p class="p-3 text-gray-600">No hay resultados</p>`;
            caja.classList.remove("hidden");
            return;
        }

        // Renderizar productos
        caja.innerHTML = datos
            .slice(0, 10)
            .map(p => `
        <div class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b flex items-center gap-2"
             onclick="location.href='/producto/${p._id}'">
            
            <img src="${p.url_img}" class="w-8 h-8 object-cover rounded" />
            
            <div class="leading-tight">
                <p class="text-sm font-medium truncate">${p.texto_1}</p>
                <p class="text-xs text-gray-500 truncate">${p.texto_2}</p>
            </div>
        </div>
    `)
            .join("");


        caja.classList.remove("hidden");
    });

    // Ocultar al hacer clic fuera
    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !caja.contains(e.target)) {
            caja.classList.add("hidden");
        }
    });
}
