const ipInput = document.getElementById('ipAddress');
const cidrInput = document.getElementById('cidr');
const modeRadios = document.getElementsByName('ipMode');
const ipv4Results = document.getElementById('ipv4-results');
const ipv6Results = document.getElementById('ipv6-results');
let currentMode = 'ipv4';


const expandIPv6 = (ip) => {
    ip = ip.toLowerCase();


    if (ip.includes('::')) {
        const parts = ip.split('::');
        const start = parts[0] ? parts[0].split(':') : [];
        const end = parts[1] ? parts[1].split(':') : [];


        const cleanStart = start.filter(p => p !== '');
        const cleanEnd = end.filter(p => p !== '');

        const missing = 8 - (cleanStart.length + cleanEnd.length);
        const middle = Array(missing).fill('0000');
        const fullParts = [...cleanStart, ...middle, ...cleanEnd];
        return fullParts.map(p => p.padStart(4, '0')).join(':');
    }

    const parts = ip.split(':');
    if (parts.length === 8) {
        return parts.map(p => p.padStart(4, '0')).join(':');
    }
    return null;
};


const ipv6ToBigInt = (expandedIp) => {
    const hex = expandedIp.split(':').join('');
    return BigInt('0x' + hex);
};


const bigIntToIPv6 = (bigint) => {
    let hex = bigint.toString(16).padStart(32, '0');
    let groups = [];
    for (let i = 0; i < 32; i += 4) {
        groups.push(hex.substring(i, i + 4));
    }
    return groups.join(':');
};


const compressIPv6 = (expandedIp) => {
    let groups = expandedIp.split(':').map(g => parseInt(g, 16).toString(16));
    let bestStart = -1, bestLen = 0;
    let currentStart = -1, currentLen = 0;

    for (let i = 0; i < 8; i++) {
        if (groups[i] === '0') {
            if (currentStart === -1) currentStart = i;
            currentLen++;
        } else {
            if (currentLen > bestLen) {
                bestLen = currentLen;
                bestStart = currentStart;
            }
            currentStart = -1;
            currentLen = 0;
        }
    }
    if (currentLen > bestLen) {
        bestLen = currentLen;
        bestStart = currentStart;
    }

    if (bestLen > 1) {
        groups.splice(bestStart, bestLen, '');
        if (bestStart === 0 && groups[0] === '') groups[0] = '';
        if (groups[groups.length - 1] === '') groups.push('');
        return groups.join(':').replace(/:{3,}/g, '::');
    }
    return groups.join(':');
};

const calculateIPv4 = (ip, cidr) => {
    if (cidr > 32) return;
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const ipParts = ip.split('.');
    if (ipParts.length !== 4) return;
    const ipInt = ipParts.reduce((res, octet) => (res << 8) + parseInt(octet, 10), 0) >>> 0;
    const networkInt = (ipInt & mask) >>> 0;
    const broadcastInt = (networkInt | ~mask) >>> 0;
    const wildcardInt = (~mask) >>> 0;
    const intToIp = (int) => [
        (int >>> 24) & 0xFF, (int >>> 16) & 0xFF,
        (int >>> 8) & 0xFF, int & 0xFF
    ].join('.');
    const hostsPerNet = cidr === 32 ? 0 : cidr === 31 ? 0 : Math.pow(2, 32 - cidr) - 2;

    document.getElementById('netmask').value = intToIp(mask);
    document.getElementById('wildcard').value = intToIp(wildcardInt);
    document.getElementById('network').value = intToIp(networkInt);
    document.getElementById('broadcast').value = intToIp(broadcastInt);
    document.getElementById('hostMin').value = intToIp(networkInt + 1);
    document.getElementById('hostMax').value = intToIp(broadcastInt - 1);
    document.getElementById('hostsPerNet').value = hostsPerNet.toLocaleString();

    if (cidr === 31) {
        document.getElementById('hostMin').value = 'N/A';
        document.getElementById('hostMax').value = 'N/A';
    } else if (cidr === 32) {
        document.getElementById('hostMin').value = 'N/A';
        document.getElementById('hostMax').value = 'N/A';
        document.getElementById('broadcast').value = 'N/A';
        document.getElementById('network').value = ip;
    }
};

const calculateIPv6 = (ip, cidr) => {
    if (cidr > 128) return;
    const expanded = expandIPv6(ip);
    if (!expanded) return;

    try {
        const ipBigInt = ipv6ToBigInt(expanded);
        const maskBigInt = (BigInt(1) << BigInt(128)) - (BigInt(1) << BigInt(128 - cidr));
        const prefixBigInt = ipBigInt & maskBigInt;

        let hosts;
        if (cidr === 128) hosts = '1';
        else if (cidr === 127) hosts = '2';
        else hosts = `2^${128 - cidr}`;

        const rangeStart = prefixBigInt;
        const rangeEnd = prefixBigInt + (BigInt(1) << BigInt(128 - cidr)) - BigInt(1);

        document.getElementById('ipv6-compressed').value = compressIPv6(bigIntToIPv6(ipBigInt));
        document.getElementById('ipv6-expanded').value = expanded;
        document.getElementById('ipv6-prefix').value = compressIPv6(bigIntToIPv6(prefixBigInt)) + '/' + cidr;
        document.getElementById('ipv6-prefix-len').value = cidr;
        document.getElementById('ipv6-hosts').value = hosts;
        document.getElementById('ipv6-range-start').value = compressIPv6(bigIntToIPv6(rangeStart));
        document.getElementById('ipv6-range-end').value = compressIPv6(bigIntToIPv6(rangeEnd));
    } catch (e) {
        console.error("IPv6 Calc Error", e);
    }
};

const calculate = () => {
    const ip = ipInput.value.trim();
    const cidrStr = cidrInput.value.trim();

    if (!ip || !cidrStr) return;

    const cidr = parseInt(cidrStr, 10);
    if (isNaN(cidr)) return;

    if (currentMode === 'ipv4') {
        calculateIPv4(ip, cidr);
    } else {
        calculateIPv6(ip, cidr);
    }
};

modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentMode = e.target.value;
        if (currentMode === 'ipv4') {
            ipv4Results.classList.remove('hidden');
            ipv6Results.classList.add('hidden');
            document.getElementById('ipAddress').placeholder = "IP Address e.g. 192.168.1.1";
            document.getElementById('cidr').placeholder = "24";
            document.getElementById('cidr').max = "32";
        } else {
            ipv4Results.classList.add('hidden');
            ipv6Results.classList.remove('hidden');
            document.getElementById('ipAddress').placeholder = "IP Address e.g. 2001:db8::1";
            document.getElementById('cidr').placeholder = "64";
            document.getElementById('cidr').max = "128";
        }
        document.querySelectorAll('input[readonly]').forEach(i => i.value = '');
        calculate();
    });
});

ipInput.addEventListener('input', calculate);
cidrInput.addEventListener('input', calculate);

document.querySelectorAll('input[readonly]').forEach(input => {
    input.addEventListener('click', async () => {
        if (!input.value || input.value === 'N/A') return;

        try {
            await navigator.clipboard.writeText(input.value);
            input.classList.add('copy-success');
            setTimeout(() => {
                input.classList.remove('copy-success');
            }, 500);

            input.select();
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });
});