async function fetchPlanets() {
  try {
    const res = await fetch('https://dragonball-api.com/api/planets');
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();

    const container = document.getElementById('planetsSection');
    container.innerHTML = data.items.map(p => `
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition">
        <div class="w-full h-64 overflow-hidden">
          <img class="w-full h-full object-contain bg-gray-200" src="${p.image}" alt="${p.name}">
        </div>
        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-xl font-bold">${p.name}</h3>
          <p class="text-sm text-gray-500">Universo: ${p.universe}</p>
          <p class="text-sm text-gray-700">${p.description || "Sin descripción disponible"}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('planetsSection').innerHTML =
      '<p class="text-center text-red-500">Error al cargar los planetas</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchPlanets);
