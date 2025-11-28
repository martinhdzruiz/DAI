console.log("🔎 busqueda-header.js cargado");

const inputHeader = document.getElementById("search-header");
const dropdown = document.getElementById("search-dropdown");

if (inputHeader) {
    inputHeader.addEventListener("input", async () => {
        const texto = inputHeader.value.trim();

        // Si menos de 2 caracteres → ocultar dropdown
        if (texto.length < 2) {
            dropdown.classList.add("d-none");
            dropdown.innerHTML = "";
            return;
        }

        try {
            const res = await fetch(`/api/productos/busqueda-anticipada/${encodeURIComponent(texto)}`);
            const datos = await res.json();

            if (!Array.isArray(datos) || datos.length === 0) {
                dropdown.innerHTML = `<div class="p-2 text-muted">Sin resultados</div>`;
                dropdown.classList.remove("d-none");
                return;
            }

            // Render compacto del dropdown
            dropdown.innerHTML = datos
                .slice(0, 7)
                .map(p => `
                    <div class="p-2 border-bottom d-flex align-items-center gap-2 dropdown-item-header"
                         onclick="location.href='/producto/${p._id}'" style="cursor:pointer">
                        
                        <img src="${p.url_img}" style="width:40px; height:40px; object-fit:contain">

                        <div style="line-height:1;">
                            <div class="fw-bold small">${p.texto_1}</div>
                            <div class="text-muted small">${p.texto_2}</div>
                        </div>
                    </div>
                `)
                .join("");

            dropdown.classList.remove("d-none");

        } catch (err) {
            console.error("❌ Error en búsqueda anticipada header:", err);
        }
    });
}
