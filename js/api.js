const requestURL = "https://dragonball-api.com/api/characters";

export async function fetchCharacterJson() {
    try {
        const response = await fetch(requestURL);
        console.log('Estado de la respuesta:', response.status); 
        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (!response.ok) {
            throw new Error(`Error en la petición ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error(`Error al obtener los personajes de la API: `, error);
        return null;
    }
}

