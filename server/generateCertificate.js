const forge = require('node-forge');
const fs = require('fs');

function generateCertificate() {
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const cert = forge.pki.createCertificate();

  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [
    { name: 'commonName', value: 'Your Common Name' },
    { name: 'countryName', value: 'Your Country' },
    { shortName: 'ST', value: 'Your State' },
    { name: 'localityName', value: 'Your City' },
    { name: 'organizationName', value: 'Your Organization' },
    { shortName: 'OU', value: 'Your Organizational Unit' },
  ];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 6, // URI
          value: 'http://example.com/',
        },
      ],
    },
  ]);

  cert.publicKey = keyPair.publicKey;
  cert.sign(keyPair.privateKey, forge.md.sha256.create());

  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
  fs.writeFileSync('private_key.pem', privateKeyPem);

  const certificatePem = forge.pki.certificateToPem(cert);
  fs.writeFileSync('certificate.pem', certificatePem);

  console.log('Certificate generated successfully.');
}

generateCertificate();
