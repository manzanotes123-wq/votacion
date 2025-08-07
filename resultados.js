const params = new URLSearchParams(window.location.search);
const encuestaId = params.get("id");
const dbRef = db.collection("encuestas").doc(encuestaId);

async function cargarResultados() {
  const doc = await dbRef.get();
  if (!doc.exists) {
    alert("Encuesta no encontrada");
    return;
  }

  const encuesta = doc.data();
  document.getElementById("tituloEncuesta").innerText = `Resultados - ${encuesta.titulo}`;

  const sumaVotos = {};
  encuesta.candidatas.forEach(c => {
    sumaVotos[c.nombre] = 0;
  });

  // Sumar votos por cada categoría
  encuesta.categorias.forEach(cat => {
    const campo = `votos_${cat.replace(/\s+/g, "_")}`;
    const votosCat = encuesta[campo] || {};
    for (const nombre in votosCat) {
      if (sumaVotos[nombre] !== undefined) {
        sumaVotos[nombre] += votosCat[nombre];
      }
    }
  });

  // Ordenar por total
  const ordenados = Object.entries(sumaVotos)
    .sort((a, b) => b[1] - a[1]);

  const labels = ordenados.map(e => e[0]);
  const data = ordenados.map(e => e[1]);

  // Asignar colores: 1° oro, 2° azul, 3° bronce, resto gris
  const colores = data.map((_, i) => {
    if (i === 0) return "gold";
    if (i === 1) return "blue";
    if (i === 2) return "sienna";
    return "gray";
  });

  // Mostrar a la ganadora
  const nombreGanadora = labels[0];
  const candidata = encuesta.candidatas.find(c => c.nombre === nombreGanadora);
  document.getElementById("ganadora").innerText =
    `👑 Señorita UMG: ${nombreGanadora} (${candidata.carrera})`;

  // Mostrar gráfica
  const ctx = document.getElementById("graficaFinal").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Votos Totales",
        data,
        backgroundColor: colores
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      }
    }
  });
}

cargarResultados();
