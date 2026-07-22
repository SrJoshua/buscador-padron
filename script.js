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

        // Cargar la lista de planillas
        const lista = await fetch("datos/planillas.json");
        const archivos = await lista.json();

        let personaEncontrada = null;

        for (const archivo of archivos) {

            const respuesta = await fetch(`datos/${archivo}`);
            const personas = await respuesta.json();

            personaEncontrada = personas.find(persona =>
                String(persona.cedula) === cedula
            );

            if (personaEncontrada) break;
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
                            <td><strong>Apellido</strong></td>
                            <td>${personaEncontrada.apellido}</td>
                        </tr>

                        <tr>
                            <td><strong>Cédula</strong></td>
                            <td>${personaEncontrada.cedula}</td>
                        </tr>

                        <tr>
                            <td><strong>Sexo</strong></td>
                            <td>${personaEncontrada.sexo}</td>
                        </tr>

                        <tr>
                            <td><strong>Fecha de nacimiento</strong></td>
                            <td>${personaEncontrada.fec_nac}</td>
                        </tr>

                        <tr>
                            <td><strong>Local de votación</strong></td>
                            <td>${personaEncontrada.des_loc}</td>
                        </tr>

                        <tr>
                            <td><strong>Distrito</strong></td>
                            <td>${personaEncontrada.des_dis}</td>
                        </tr>

                        <tr>
                            <td><strong>Departamento</strong></td>
                            <td>${personaEncontrada.des_dep}</td>
                        </tr>

                        <tr>
                            <td><strong>Tipo de inscripción</strong></td>
                            <td>${personaEncontrada.tipoinscri}</td>
                        </tr>

                        <tr>
                            <td><strong>Nacionalidad</strong></td>
                            <td>${personaEncontrada.nacionalidad}</td>
                        </tr>

                        <tr>
                            <td><strong>Discapacidad</strong></td>
                            <td>${personaEncontrada.discapacidad}</td>
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
                ❌ Error al cargar las planillas.
            </div>
        `;

    }
}
// ==============================
// DASHBOARD
// ==============================

cargarDashboard();

async function cargarDashboard() {

    try {

        const lista = await fetch("datos/planillas.json");
        const archivos = await lista.json();

        let total = 0;

        const estadisticas = {};

        for (const archivo of archivos) {

            const respuesta = await fetch(`datos/${archivo}`);
            const personas = await respuesta.json();

            total += personas.length;

            personas.forEach(persona => {

                const local = persona.des_loc || "Sin local";

                if (!estadisticas[local]) {
                    estadisticas[local] = 0;
                }

                estadisticas[local]++;

            });

        }

        document.getElementById("totalPersonas").textContent =
            total.toLocaleString("es-PY");

        document.getElementById("cantidadLocales").textContent =
            Object.keys(estadisticas).length;

        const tbody = document.getElementById("tablaLocales");

        tbody.innerHTML = "";

        const labels = [];
        const datos = [];

        Object.entries(estadisticas)
            .sort((a, b) => b[1] - a[1])
            .forEach(([local, cantidad]) => {

                labels.push(local);
                datos.push(cantidad);

                const porcentaje =
                    ((cantidad / total) * 100).toFixed(2);

                tbody.innerHTML += `
                    <tr>
                        <td>${local}</td>
                        <td>${cantidad.toLocaleString("es-PY")}</td>
                        <td>${porcentaje}%</td>
                    </tr>
                `;

            });

        // Gráfico de barras

        new Chart(

            document.getElementById("graficoLocales"),

            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label: "Personas",

                        data: datos,

                        backgroundColor: "#b10000"

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }

        );

        // Gráfico circular

        new Chart(

            document.getElementById("graficoPie"),

            {

                type: "pie",

                data: {

                    labels: labels,

                    datasets: [{

                        data: datos,

                        backgroundColor: [

                            "#b10000",
                            "#d62828",
                            "#ef233c",
                            "#ff595e",
                            "#ff7b7b",
                            "#ff9f9f",
                            "#c1121f",
                            "#780000",
                            "#9d0208",
                            "#dc2f02",
                            "#e85d04",
                            "#f48c06"

                        ]

                    }]

                },

                options: {

                    responsive: true

                }

            }

        );

    }

    catch (error) {

        console.error("Error cargando estadísticas:", error);

    }

}
