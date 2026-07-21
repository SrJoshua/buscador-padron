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
            
            <h2>✅ Persona encontrada</h2>
            
            <table>
            
            <tr>
            <td><strong>Nombre</strong></td>
            <td>${personaEncontrada.nombre}</td>
            </tr>
            
            <tr>
            <td><strong>Cédula</strong></td>
            <td>${personaEncontrada.cedula}</td>
            </tr>
            
            <tr>
            <td><strong>Mesa</strong></td>
            <td>${personaEncontrada.mesa}</td>
            </tr>
            
            <tr>
            <td><strong>Orden</strong></td>
            <td>${personaEncontrada.orden}</td>
            </tr>
            
            <tr>
            <td><strong>Local</strong></td>
            <td>${personaEncontrada.local}</td>
            </tr>
            
            </table>
            
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
document
.getElementById("cedula")
.addEventListener("keypress",function(e){

    if(e.key==="Enter"){
        buscarPersona();
    }

});
