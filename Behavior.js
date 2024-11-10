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

    // Calcular la máscara de red
    const mask = (0xFFFFFFFF << (32 - netmask)) >>> 0;
    const netmaskParts = [
        (mask >> 24) & 0xFF,
        (mask >> 16) & 0xFF,
        (mask >> 8) & 0xFF,
        mask & 0xFF
    ];

    // Calcular la dirección de red
    const ipInt = ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
    const networkInt = ipInt & mask;
    const networkParts = [
        (networkInt >> 24) & 0xFF,
        (networkInt >> 16) & 0xFF,
        (networkInt >> 8) & 0xFF,
        networkInt & 0xFF
    ];

    // Calcular la dirección de broadcast
    const broadcastInt = networkInt | (~mask >>> 0);
    const broadcastParts = [
        (broadcastInt >> 24) & 0xFF,
        (broadcastInt >> 16) & 0xFF,
        (broadcastInt >> 8) & 0xFF,
        broadcastInt & 0xFF
    ];

    // Mostrar resultados
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p><strong>Dirección IP:</strong> ${ipAddress}</p>
        <p><strong>Máscara de Red:</strong> ${netmaskParts.join('.')} / ${netmask}</p>
        <p><strong>Dirección de Red:</strong> ${networkParts.join('.')}</p>
        <p><strong>Dirección de Broadcast:</strong> ${broadcastParts.join('.')}</p>
        <p><strong>Número de Hosts:</strong> ${Math.pow(2, 32 - netmask) - 2}</p>
    `;
}