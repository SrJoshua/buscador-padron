const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

boton.addEventListener("click", buscarPersona);

async function buscarPersona() {

    const cedula = document.getElementById("cedula").value.trim();

    if (cedula === "") {
        alert("Ingrese una cédula.");
        return;
    }

    // Lista de todas las planillas
    const archivos = [
        "datos/loma_merlo.json",
        "datos/manuel_dominguez.json"
    ];

    let personaEncontrada = null;

    for (const archivo of archivos) {

        const respuesta = await fetch(archivo);
        const personas = await respuesta.json();

        personaEncontrada = personas.find(p => p.cedula == cedula);

        if (personaEncontrada) {
            break;
        }

    }

    if (personaEncontrada) {

        resultado.innerHTML = `
            <div class="card">
                <h2>${personaEncontrada.nombre}</h2>

                <p><strong>C.I.</strong> ${personaEncontrada.cedula}</p>

                <p><strong>Mesa:</strong> ${personaEncontrada.mesa}</p>

                <p><strong>Orden:</strong> ${personaEncontrada.orden}</p>

                <p><strong>Local:</strong> ${personaEncontrada.local}</p>

            </div>
        `;

    } else {

        resultado.innerHTML = `
            <div class="error">
                No se encontró ninguna persona.
            </div>
        `;

    }

}
