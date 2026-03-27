const crypto = require('crypto');

/**
 * Handles the ECDH Handshake
 * @param {string} clientPublicKeyBase64 - The public key sent by the Ktor client
 */
function handleHandshake(clientPublicKeyBase64) {
    // 1. Initialize ECDH with the same curve (secp256r1 / prime256v1)
    const serverECDH = crypto.createECDH('prime256v1');
    const serverPublicKey = serverECDH.generateKeys();


    console.log(serverPublicKey)
    console.log(serverPublicKey.toString('base64'))

    // 2. Decode the Client's Public Key
    const clientPublicKey = Buffer.from(clientPublicKeyBase64, 'base64');

    console.log(clientPublicKey)

    // 3. Compute Shared Secret
    const sharedSecret = serverECDH.computeSecret(clientPublicKey);

    console.log(sharedSecret)

    // 4. Hash the secret to get a consistent 32-byte AES key
    const aesKey = crypto.createHash('sha256').update(sharedSecret).digest()

    console.log(aesKey)

    return {
        serverPublicKey: serverPublicKey.toString('base64'),
        aesKey: aesKey // This is the final symmetric key
    };
}

const express = require('express');
const app = express();

app.get('/handshake', (req, res) => {
    const clientKey = req.headers['x-client-public-key'];

    if (!clientKey) {
        return res.status(400).send('Missing Client Public Key');
    }

    try {
        const { serverPublicKey, aesKey } = handleHandshake(clientKey);

        // LOGGING: In production, never log the aesKey!
        console.log(`Shared AES Key Derived: ${aesKey.toString('hex')}`);

        // Send server public key back in headers
        res.setHeader('X-Server-Public-Key', serverPublicKey);
        res.status(200).json({ status: "Handshake Complete" });
    } catch (error) {
        res.status(500).send('Handshake Failed');
    }
});

app.listen(3600, () => console.log('Auth Server running on port 3600'));