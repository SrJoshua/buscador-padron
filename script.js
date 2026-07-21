const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

boton.addEventListener("click", buscarPersona);

async function buscarPersona() {

    const cedula = document.getElementById("cedula").value.trim();
    const local = document.getElementById("local").value;

    if (cedula === "") {
        alert("Ingrese una cédula.");
        return;
    }

    const respuesta = await fetch(`datos/${local}.json`);
    const personas = await respuesta.json();

    const persona = personas.find(p => p.cedula == cedula);

    if (persona) {

        resultado.innerHTML = `
            <div class="card">
                <h2>${persona.nombre}</h2>

                <p><strong>C.I.</strong> ${persona.cedula}</p>

                <p><strong>Mesa:</strong> ${persona.mesa}</p>

                <p><strong>Orden:</strong> ${persona.orden}</p>

                <p><strong>Local:</strong> ${persona.local}</p>

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
