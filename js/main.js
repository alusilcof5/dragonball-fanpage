import { fetchCharacterJson } from './api.js';

function createCharacterCard({ image, name, race, gender, ki, max_ki, affiliation, description }) {
    return `
        <div class="character-card bg-white w-full rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
             data-character='${JSON.stringify({ image, name, race, gender, ki, max_ki, affiliation, description }).replace(/'/g, "&apos;")}'>
            <div class="w-full h-72 overflow-hidden">
               <img class="w-full h-full object-contain bg-gray-200" src="${image}" alt="${name}">
            </div>
            <div class="p-6 flex flex-col gap-3">
                <h5 class="text-3xl font-bold text-gray-800">${name}</h5>
                <p class="text-base text-gray-500">${race} - ${gender}</p>
                <ul class="text-base text-gray-700 mt-2 space-y-1">
                    <li><span class="font-semibold">Ki:</span> ${ki}</li>
                    <li><span class="font-semibold">Max Ki:</span> ${max_ki}</li>
                    <li><span class="font-semibold">Affiliation:</span> ${affiliation}</li>
                </ul>
            </div>
        </div>`;
}

// --- Variables globales ---
let allCharacters = [];
let currentPage = 1;
const itemsPerPage = 20;

// --- Renderizado de página ---
function renderPage(page) {
    const characterSection = document.getElementById('charactersection');
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageCharacters = allCharacters.slice(startIndex, endIndex);

    characterSection.innerHTML = pageCharacters.length > 0
        ? pageCharacters.map(createCharacterCard).join('')
        : '<p class="text-center text-gray-500">No se encontraron personajes</p>';

    // Asignar eventos de click a cada card para abrir el modal
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const data = JSON.parse(card.getAttribute('data-character').replace(/&apos;/g, "'"));
            openModal(data);
        });
    });
}

// --- Fetch de TODOS los personajes ---
async function fetchAllCharacters() {
    let all = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(`https://dragonball-api.com/api/characters?page=${page}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        all = [...all, ...data.items];

        if (data.links?.next) {
            page++;
        } else {
            hasMore = false;
        }
    }

    return all;
}

// --- Modal ---
const modal = document.getElementById("characterModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalKi = document.getElementById("modalKi");
const modalMaxKi = document.getElementById("modalMaxKi");
const modalRace = document.getElementById("modalRace");
const modalGender = document.getElementById("modalGender");
const modalAffiliation = document.getElementById("modalAffiliation");

function openModal(character) {
    modalImage.src = character.image;
    modalName.textContent = character.name;
    modalDescription.textContent = character.description || "Sin descripción disponible.";
    modalKi.textContent = character.ki || "Desconocido";
    modalMaxKi.textContent = character.max_ki || "Desconocido";
    modalRace.textContent = character.race || "Desconocido";
    modalGender.textContent = character.gender || "Desconocido";
    modalAffiliation.textContent = character.affiliation || "Desconocido";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
}

function closeModal() {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });


async function displayCharacters() {
    try {
        allCharacters = await fetchAllCharacters();
        renderPage(currentPage);

        const pagination = document.getElementById('pagination');
        pagination.innerHTML = `
            <button id="prevPage" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50">Anterior</button>
            <button id="nextPage" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50">Siguiente</button>
        `;

        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage < Math.ceil(allCharacters.length / itemsPerPage)) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    } catch (error) {
        document.getElementById('charactersection').innerHTML =
            '<p class="text-center text-red-500">Error al cargar los datos</p>';
    }
}

document.addEventListener('DOMContentLoaded', displayCharacters);
