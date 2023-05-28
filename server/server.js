const express = require('express');
const cors = require('cors');
// const fs = require('fs');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');

const app = express();
const port = 4000;
const secretKey = 'your-secret-key';

app.use(express.json());
app.use(cors());

app.post('/generate-certificate', (req, res) => {
  try {
    const { email } = req.body;
    
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [
      { name: 'commonName', value: 'example.org' },
      { name: 'organizationName', value: 'Example Organization' },
      { name: 'organizationalUnitName', value: 'Example Unit' },
      { name: 'emailAddress', value: email }
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey, forge.md.sha256.create());

    const certificatePem = forge.pki.certificateToPem(cert);
    // const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

    res.set('Content-Disposition', 'attachment; filename=certificate.pem');
    res.send(certificatePem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
});

app.post('/login', (req, res) => {
  const { certificate } = req.body;

  if (certificate) {
    // Perform authentication and authorization checks
    // ...

    // If the certificate is valid, generate a token
    const token = jwt.sign({ certificate }, secretKey);

    res.status(200).json({ token: token }); // Include the token in the response
  } else {
    res.status(403).send('Certificate not found.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
