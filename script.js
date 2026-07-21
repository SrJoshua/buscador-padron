const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");
const inputCedula = document.getElementById("cedula");

boton.addEventListener("click", buscarPersona);

inputCedula.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        buscarPersona();
    }
});

async function buscarPersona() {

    const cedula = inputCedula.value.trim();

    if (cedula === "") {
        resultado.innerHTML = `
            <div class="error">
                Ingrese un número de cédula.
            </div>
        `;
        return;
    }

    resultado.innerHTML = `
        <div class="card">
            <h2>🔎 Buscando...</h2>
        </div>
    `;

    try {

        // Lee la lista de planillas
        const lista = await fetch("datos/planillas.json");
        const archivos = await lista.json();

        let personaEncontrada = null;

        for (const nombreArchivo of archivos) {

            const respuesta = await fetch(`datos/${nombreArchivo}`);
            const personas = await respuesta.json();

            personaEncontrada = personas.find(
                p => String(p.cedula).trim() === cedula
            );

            if (personaEncontrada) {
                break;
            }
        }

        if (personaEncontrada) {

            resultado.innerHTML = `
                <div class="card">

                    <h2>✅ Persona encontrada</h2>

                    <table>

                        <tr>
                            <td>Nombre</td>
                            <td>${personaEncontrada.nombre}</td>
                        </tr>

                        <tr>
                            <td>Cédula</td>
                            <td>${personaEncontrada.cedula}</td>
                        </tr>

                        <tr>
                            <td>Mesa</td>
                            <td>${personaEncontrada.mesa}</td>
                        </tr>

                        <tr>
                            <td>Orden</td>
                            <td>${personaEncontrada.orden}</td>
                        </tr>

                        <tr>
                            <td>Local</td>
                            <td>${personaEncontrada.local}</td>
                        </tr>

                    </table>

                </div>
            `;

        } else {

            resultado.innerHTML = `
                <div class="error">
                    ❌ No se encontró ninguna persona con esa cédula.
                </div>
            `;

        }

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <div class="error">
                Ocurrió un error al cargar las planillas.
            </div>
        `;

    }
}
