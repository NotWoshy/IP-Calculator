function calculateIP() {
const ipAddress = document.getElementById('ip-address').value;
const netmask = parseInt(document.getElementById('netmask').value, 10);
const moveNetmask = parseInt(document.getElementById('move-netmask').value, 10);

if (!ipAddress || isNaN(netmask)) {
    alert('Por favor, ingresa una dirección IP válida y una máscara de red.');
    return;
}

// Convertir la IP a binario
const ipParts = ipAddress.split('.').map(Number);
if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
    alert('Dirección IP inválida.');
    return;
}

// Mascara de Red
const mask = (0xFFFFFFFF << (32 - netmask)) >>> 0;
const netmaskParts = [
    (mask >> 24) & 0xFF,
    (mask >> 16) & 0xFF,
    (mask >> 8) & 0xFF,
    mask & 0xFF
];

// Dirección de Subred
const ipInt = ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
const networkInt = ipInt & mask;
const networkParts = [
    (networkInt >> 24) & 0xFF,
    (networkInt >> 16) & 0xFF,
    (networkInt >> 8) & 0xFF,
    networkInt & 0xFF
];

// Dirección de Broadcast
const broadcastInt = networkInt | (~mask >>> 0);
const broadcastParts = [
    (broadcastInt >> 24) & 0xFF,
    (broadcastInt >> 16) & 0xFF,
    (broadcastInt >> 8) & 0xFF,
    broadcastInt & 0xFF
];

// Primer | Último Host
const firstHostInt = networkInt + 1;
const lastHostInt = broadcastInt - 1;
const firstHostParts = [
    (firstHostInt >> 24) & 0xFF,
    (firstHostInt >> 16) & 0xFF,
    (firstHostInt >> 8) & 0xFF,
    firstHostInt & 0xFF
];
const lastHostParts = [
    (lastHostInt >> 24) & 0xFF,
    (lastHostInt >> 16) & 0xFF,
    (lastHostInt >> 8) & 0xFF,
    lastHostInt & 0xFF
];



// Mostrar resultados
const resultDiv = document.getElementById('result');
resultDiv.innerHTML = `
    <p><strong>Dirección IP:</strong> ${ipAddress}</p>
    <p><strong>Máscara de Red:</strong> ${netmaskParts.join('.')} / ${netmask}</p>
    <p><strong>Dirección de Subred:</strong> ${networkParts.join('.')}</p>
    <p><strong>Primer Host Asignable:</strong> ${firstHostParts.join('.')}</p>
    <p><strong>Último Host Asignable:</strong> ${lastHostParts.join('.')}</p>
    <p><strong>Dirección de Broadcast:</strong> ${broadcastParts.join('.')}</p>
    <p><strong>Número de Hosts:</strong> ${Math.pow(2, 32 - netmask) - 2}</p>
`;


}

