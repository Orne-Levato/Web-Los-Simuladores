

/*carruselito*/ 

const carousel = document.querySelector(".carousel");
const tarjetas = carousel.querySelectorAll(".tarjeta");
const sidebars = document.querySelectorAll(".sidebar-item");
const resenasCarrusel = document.querySelector(".resenas-carrusel");
const resenaAnterior = document.querySelector(".resenas-anterior");
const resenaSiguiente = document.querySelector(".resenas-siguiente");

let actual = 0;
let escrituraId = 0;

function animarEscritura(sidebar) {
    const idActual = ++escrituraId;
    const textos = sidebar.querySelectorAll("h3, h4, p");
    let elementoActual = 0;

    textos.forEach(elemento => {
        elemento.style.visibility = "hidden";
    });

    function escribirElemento() {
        if (idActual !== escrituraId || elementoActual >= textos.length) {
            return;
        }

        const elemento = textos[elementoActual];
        const textoCompleto = elemento.dataset.textoCompleto || elemento.textContent;
        elemento.dataset.textoCompleto = textoCompleto;
        let caracterActual = 0;
        elemento.style.visibility = "visible";
        elemento.textContent = "";

        function escribirCaracter() {
            if (idActual !== escrituraId) {
                return;
            }

            elemento.textContent = textoCompleto.slice(0, caracterActual);
            caracterActual++;

            if (caracterActual <= textoCompleto.length) {
                setTimeout(escribirCaracter, 28);
            } else {
                elementoActual++;
                setTimeout(escribirElemento, 180);
            }
        }

        escribirCaracter();
    }

    escribirElemento();
}

function mostrarTarjeta(indice) {

    tarjetas.forEach(tarjeta => {
        tarjeta.classList.remove("active");
    });

    sidebars.forEach(sidebar => {
        sidebar.classList.remove("active");
    });

    tarjetas[indice].classList.add("active");
    sidebars[indice].classList.add("active");
    animarEscritura(sidebars[indice]);
}


carousel.querySelector(".siguiente").addEventListener("click", () => {

    actual++;

    if (actual >= tarjetas.length) {
        actual = 0;
    }

    mostrarTarjeta(actual);
});


carousel.querySelector(".anterior").addEventListener("click", () => {

    actual--;

    if (actual < 0) {
        actual = tarjetas.length - 1;
    }

    mostrarTarjeta(actual);
});

animarEscritura(sidebars[actual]);

resenaAnterior.addEventListener("click", () => {
    resenasCarrusel.scrollBy({ left: -345, behavior: "smooth" });
});

resenaSiguiente.addEventListener("click", () => {
    resenasCarrusel.scrollBy({ left: 345, behavior: "smooth" });
});

/*fin carruselito*/