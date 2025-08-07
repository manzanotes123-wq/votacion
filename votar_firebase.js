import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseconfig.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let encuesta = null;
let votos = {};
let categoriaActual = 0;

function inicializarVotos() {
  encuesta.categorias.forEach(categoria => {
    votos[categoria.nombre] = null;
  });
}

function mostrarCategoria() {
  const container = document.getElementById("categoria-container");
  container.innerHTML = "";

  if (categoriaActual >= encuesta.categorias.length) {
    const finalizarBtn = document.createElement("button");
    finalizarBtn.textContent = "Finalizar Votación";
    finalizarBtn.className = "btn-votar";
    finalizarBtn.onclick = mostrarResultados;
    container.appendChild(finalizarBtn);
    return;
  }

  const categoria = encuesta.categorias[categoriaActual];
  const titulo = document.createElement("h2");
  titulo.textContent = categoria.nombre;
  container.appendChild(titulo);

  const divCategoria = document.createElement("div");
  divCategoria.className = "fade-in";

  categoria.candidatas.forEach(nombre => {
    const candidata = encuesta.candidatas.find(c => c.nombre === nombre);
    const card = document.createElement("div");
    card.className = "candidata-card-horizontal";

    const foto = document.createElement("img");
    if (candidata.foto) {
      foto.src = candidata.foto;
      foto.className = "foto-candidata";
    } else {
      foto.className = "foto-placeholder";
      foto.alt = "Sin foto";
      foto.textContent = "Sin foto";
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.innerHTML = `<strong>${candidata.nombre}</strong><br>${candidata.descripcion}`;

    const btn = document.createElement("button");
    btn.className = "btn-votar";
    btn.textContent = "Votar";
    btn.onclick = () => {
      votos[categoria.nombre] = candidata.nombre;
      categoriaActual++;
      mostrarCategoria();
    };

    card.appendChild(foto);
    card.appendChild(infoDiv);
    card.appendChild(btn);
    divCategoria.appendChild(card);
  });

  container.appendChild(divCategoria);
}

function mostrarResultados() {
  const container = document.getElementById("categoria-container");
  container.innerHTML = "<h2>Gracias por votar</h2>";

  const conteo = {};
  Object.values(votos).forEach(nombre => {
    conteo[nombre] = (conteo[nombre] || 0) + 1;
  });

  const nombres = Object.keys(conteo);
  const cantidades = Object.values(conteo);
  const totalVotos = cantidades.reduce((a, b) => a + b, 0);

  const ctx = document.getElementById("chartCanvas").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: nombres,
      datasets: [{
        label: "Cantidad de votos",
        data: cantidades,
        backgroundColor: "rgba(139, 92, 246, 0.7)"
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Total de votos: ${totalVotos}`
        },
        tooltip: {
          callbacks: {
            label: ctx => `Votos: ${ctx.raw}`
          }
        }
      }
    }
  });
}

function iniciarVotacion() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    alert("Falta el ID en la URL");
    return;
  }

  const docRef = doc(db, "encuestas", id);
  getDoc(docRef)
    .then(docSnap => {
      if (!docSnap.exists()) {
        alert("Encuesta no encontrada");
        return;
      }

      encuesta = docSnap.data();
      inicializarVotos();
      mostrarCategoria();
    })
    .catch(error => {
      console.error("Error al cargar la encuesta:", error);
      alert("Error al cargar encuesta.");
    });
}

window.onload = () => iniciarVotacion();
