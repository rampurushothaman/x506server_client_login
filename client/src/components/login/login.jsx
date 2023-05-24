import React, { useState } from 'react';
import forge from 'node-forge';

const CertificateLogin = () => {
  const [certificateFile, setCertificateFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCertificateFile(file);
  };

  const handleLogin = () => {
    if (certificateFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const certificateData = reader.result;
        const parsedCertificate = parsePEMCertificate(certificateData);

        if (parsedCertificate) {
          // Extract the desired information from the certificate
          const subjectName = parsedCertificate.subject;
          const issuerName = parsedCertificate.issuer;
          const validityStart = parsedCertificate.validFrom;
          const validityEnd = parsedCertificate.validTo;

          // Use the extracted information for further processing or display
          console.log('Subject Name:', subjectName);
          console.log('Issuer Name:', issuerName);
          console.log('Validity Start:', validityStart);
          console.log('Validity End:', validityEnd);
        } else {
          console.error('Error parsing certificate.');
        }
      };
      reader.readAsText(certificateFile);
    }
  };

  const parsePEMCertificate = (pemCertificate) => {
    try {
      const cert = forge.pki.certificateFromPem(pemCertificate);
      return {
        subject: cert.subject.getField('CN').value,
        issuer: cert.issuer.getField('CN').value,
        validFrom: cert.validity.notBefore,
        validTo: cert.validity.notAfter,
      };
    } catch (error) {
      console.error('Error parsing PEM certificate:', error);
      return null;
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default CertificateLogin;
