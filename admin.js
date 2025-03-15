const API_URL = `http://localhost:3000/locations`;
const form = document.getElementById('location-form');
const list = document.getElementById('locations-list');
const idField = document.getElementById('location-id');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location-form');
    const idField = document.getElementById('location-id');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Form submitted!');
        const name = document.getElementById('location-name').value;
        const district = document.getElementById('district').value;
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        console.log(lat, lng);
        const id = idField.value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, district, lat, lng })
        });

        form.reset();
        idField.value = '';
        loadLocations();
    });
});

async function loadLocations() {
    const res = await fetch(API_URL);
    const locations = await res.json();
    list.innerHTML = locations.map(loc => `
        <li>
            ${loc.name} - ${loc.district} (${parseFloat(loc.lat)}, ${parseFloat(loc.lng)}) 
            <button onclick="editLocation(${loc.id}, '${loc.name}', '${loc.district}', ${loc.lat}, ${loc.lng})">Edit</button>
            <button onclick="deleteLocation(${loc.id})">Delete</button>
        </li>
    `).join('');
}

function editLocation(id, name, district, lat, lng) {
    document.getElementById('location-id').value = id;
    document.getElementById('location-name').value = name;
    document.getElementById('district').value = district;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
}

async function deleteLocation(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadLocations();
}

document.addEventListener('DOMContentLoaded', loadLocations);