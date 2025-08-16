async function fetchTransformations() {
  try {
    const res = await fetch('https://dragonball-api.com/api/transformations');
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();

    const container = document.getElementById('transformationsSection');
    container.innerHTML = data.map(t => `
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
        <div class="w-full h-64 overflow-hidden">
          <img class="w-full h-full object-contain bg-gray-200"
               src="${t.image}" alt="${t.name}">
        </div>
        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-xl font-bold">${t.name}</h3>
          <p class="text-sm text-gray-500">Power Level: ${t.ki}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('transformationsSection').innerHTML =
      '<p class="text-center text-red-500">Error al cargar las transformaciones</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchTransformations);
