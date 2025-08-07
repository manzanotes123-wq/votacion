import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { doc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseconfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let candidatas = [];

function agregarCandidata() {
    const nombre = document.getElementById("nombre").value;
    const carrera = document.getElementById("carrera").value;
    const fotoUrl = document.getElementById("fotoUrl").value;

    if (!nombre || !carrera) {
        alert("Por favor, completa nombre y carrera.");
        return;
    }

    const nuevaCandidata = { nombre, carrera, fotoUrl };
    candidatas.push(nuevaCandidata);

    mostrarCandidatas();
    document.getElementById("nombre").value = "";
    document.getElementById("carrera").value = "";
    document.getElementById("fotoUrl").value = "";
}

function mostrarCandidatas() {
    const contenedor = document.getElementById("listaCandidatas");
    contenedor.innerHTML = "<h3>Candidatas añadidas:</h3>";

    candidatas.forEach((candidata) => {
        contenedor.innerHTML += `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 10px;">
                <strong>${candidata.nombre}</strong><br>
                <em>${candidata.carrera}</em><br>
                ${candidata.fotoUrl ? `<img src="${candidata.fotoUrl}" alt="Foto" style="width:100px;">` : ''}
            </div>
        `;
    });
}

function generarID() {
    return Math.random().toString(36).substring(2, 10);
}

async function guardarEncuesta() {
    const titulo = document.getElementById("titulo").value;
    const categoriasTexto = document.getElementById("categorias").value;

    if (!titulo || !categoriasTexto || candidatas.length === 0) {
        alert("Completa todos los campos y agrega al menos una candidata.");
        return;
    }

    const categorias = categoriasTexto.split(",").map(nombre => ({
        nombre: nombre.trim(),
        candidatas: candidatas.map(c => c.nombre)
    }));

    const idEncuesta = generarID();
    const encuesta = { titulo, categorias, candidatas };

    try {
        await setDoc(doc(db, "encuestas", idEncuesta), encuesta);

        const link = `${location.origin}/votar.html?id=${idEncuesta}`;
        const contenedor = document.getElementById("listaCandidatas");

        contenedor.innerHTML += `
            <div style="margin-top: 20px;">
                ✅ Encuesta guardada con éxito.<br>
                <b>Link para votar:</b><br>
                <input type="text" value="${link}" readonly style="width: 100%; padding: 6px;">
            </div>
        `;
    } catch (e) {
        console.error("Error al guardar encuesta:", e);
        alert("Error al guardar la encuesta.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("agregarCandidata").addEventListener("click", agregarCandidata);
    document.getElementById("guardarEncuesta").addEventListener("click", guardarEncuesta);
});
