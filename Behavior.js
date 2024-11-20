function calculateIP() {
    const ipAddress = document.getElementById('ip-address').value;
    const netmask = parseInt(document.getElementById('netmask').value, 10);
    const subnetMask = parseInt(document.getElementById('subnet-mask').value, 10); // Nuevo campo para subneteo

    if (!ipAddress || isNaN(netmask) || subnetMask < netmask || subnetMask > 32) {
        alert('Ingresa una dirección IP válida y máscaras válidas.');
        return;
    }

    const ipParts = ipAddress.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
        alert('Dirección IP inválida.');
        return;
    }

    const mask = (0xFFFFFFFF << (32 - netmask)) >>> 0;
    const ipInt = ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
    const networkInt = ipInt & mask;
    const networkParts = [
        (networkInt >> 24) & 0xFF,
        (networkInt >> 16) & 0xFF,
        (networkInt >> 8) & 0xFF,
        networkInt & 0xFF
    ];

    const broadcastInt = networkInt | (~mask >>> 0);
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

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p><strong>Dirección IP:</strong> ${ipAddress}</p>
        <p><strong>Máscara de Red:</strong> ${maskToString(mask)} / ${netmask}</p>
        <p><strong>Dirección de Red:</strong> ${networkParts.join('.')}</p>
        <p><strong>Dirección de Broadcast:</strong> ${broadcastToString(broadcastInt)}</p>
        <p><strong>Primer Host Asignable:</strong> ${firstHostParts.join('.')}</p>
        <p><strong>Último Host Asignable:</strong> ${lastHostParts.join('.')}</p>
        <p><strong>Número de Hosts:</strong> ${Math.pow(2, 32 - netmask) - 2}</p>
    `;

    // Subneteo
    const subnetCount = Math.pow(2, subnetMask - netmask);
    const subnetSize = Math.pow(2, 32 - subnetMask);

    resultDiv.innerHTML += `<h3>Subredes</h3><p>Número de Subredes: ${subnetCount}</p>`;
    for (let i = 0; i < subnetCount; i++) {
        const subnetNetworkInt = networkInt + (i * subnetSize);
        const subnetBroadcastInt = subnetNetworkInt + subnetSize - 1;
        const subnetFirstHostInt = subnetNetworkInt + 1;
        const subnetLastHostInt = subnetBroadcastInt - 1;

        resultDiv.innerHTML += `
            <hr>
            <p><strong>Subred ${i + 1}</strong></p>
            <p><strong>Dirección de Subred:</strong> ${intToIP(subnetNetworkInt)}</p>
            <p><strong>Primer Host Asignable:</strong> ${intToIP(subnetFirstHostInt)}</p>
            <p><strong>Último Host Asignable:</strong> ${intToIP(subnetLastHostInt)}</p>
            <p><strong>Dirección de Broadcast:</strong> ${intToIP(subnetBroadcastInt)}</p>
            <p><strong>Número de Hosts:</strong> ${subnetSize - 2}</p>
        `;
    }
}

function maskToString(mask) {
    return [
        (mask >> 24) & 0xFF,
        (mask >> 16) & 0xFF,
        (mask >> 8) & 0xFF,
        mask & 0xFF
    ].join('.');
}

function broadcastToString(broadcastInt) {
    return [
        (broadcastInt >> 24) & 0xFF,
        (broadcastInt >> 16) & 0xFF,
        (broadcastInt >> 8) & 0xFF,
        broadcastInt & 0xFF
    ].join('.');
}

function intToIP(int) {
    return [
        (int >> 24) & 0xFF,
        (int >> 16) & 0xFF,
        (int >> 8) & 0xFF,
        int & 0xFF
    ].join('.');
}
