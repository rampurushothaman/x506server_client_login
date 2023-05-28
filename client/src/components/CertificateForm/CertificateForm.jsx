import React, { useState } from "react";
import axios from "axios";

const CertificateForm = () => {
  const server = "http://localhost:4000";
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(server + "/generate-certificate", { email }, { responseType: "blob" });
      const certificateFile = new Blob([response.data], { type: "application/x-x509-user-cert" });
      const downloadUrl = URL.createObjectURL(certificateFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "certificate.pem";
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Certificate Generator</h1>
      <form onSubmit={handleSubmit}>
        <input required type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Generate Certificate</button>
      </form>
    </div>
  );
};

export default CertificateForm;
