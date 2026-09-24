const quizCards = document.querySelectorAll(".quiz-card");
const puntaje = document.querySelector("#puntaje");
const estadoGuardado = document.querySelector("#estado-guardado");
const claveResultados = "losSimuladoresTest";

let respuestas = Array.from({ length: quizCards.length }, () => null);

function actualizarResultado() {
    const respondidas = respuestas.filter(respuesta => respuesta !== null).length;
    const correctas = respuestas.filter((respuesta, indicePregunta) => {
        if (respuesta === null) {
            return false;
        }

        return quizCards[indicePregunta]
            .querySelectorAll(".opciones button")[respuesta]
            .dataset.correct === "true";
    }).length;

    puntaje.textContent = `${correctas} / ${quizCards.length}`;

    if (respondidas === quizCards.length) {
        estadoGuardado.textContent = "Resultado guardado en este navegador.";
    } else if (respondidas > 0) {
        estadoGuardado.textContent = `${respondidas} de ${quizCards.length} respuestas guardadas.`;
    } else {
        estadoGuardado.textContent = "Tus respuestas se guardan automáticamente.";
    }
}

function guardarResultados() {
    localStorage.setItem(claveResultados, JSON.stringify({
        respuestas,
        puntaje: respuestas.filter((respuesta, indicePregunta) => {
            if (respuesta === null) {
                return false;
            }

            return quizCards[indicePregunta]
                .querySelectorAll(".opciones button")[respuesta]
                .dataset.correct === "true";
        }).length,
        fecha: new Date().toISOString()
    }));
}

function seleccionarRespuesta(indicePregunta, boton) {
    const botones = quizCards[indicePregunta].querySelectorAll(".opciones button");

    botones.forEach(opcion => opcion.classList.remove("seleccionada"));
    boton.classList.add("seleccionada");
    respuestas[indicePregunta] = Array.from(botones).indexOf(boton);

    guardarResultados();
    actualizarResultado();
}

function cargarResultados() {
    const datosGuardados = localStorage.getItem(claveResultados);

    if (!datosGuardados) {
        actualizarResultado();
        return;
    }

    try {
        const datos = JSON.parse(datosGuardados);

        if (!Array.isArray(datos.respuestas) || datos.respuestas.length !== quizCards.length) {
            actualizarResultado();
            return;
        }

        respuestas = datos.respuestas;

        quizCards.forEach((tarjeta, indicePregunta) => {
            const indiceRespuesta = respuestas[indicePregunta];
            if (indiceRespuesta === null || !Number.isInteger(indiceRespuesta)) {
                return;
            }

            const botonCorrecto = tarjeta.querySelectorAll(".opciones button")[indiceRespuesta];

            if (botonCorrecto) {
                botonCorrecto.classList.add("seleccionada");
            }
        });

        actualizarResultado();
    } catch {
        localStorage.removeItem(claveResultados);
        actualizarResultado();
    }
}

quizCards.forEach((tarjeta, indicePregunta) => {
    tarjeta.querySelectorAll(".opciones button").forEach(boton => {
        boton.addEventListener("click", () => {
            seleccionarRespuesta(indicePregunta, boton);
        });
    });
});

cargarResultados();
