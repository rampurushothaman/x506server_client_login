const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

// Configure SSL/TLS options
// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'path/to/private/key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'path/to/certificate.pem')),
//   requestCert: true, // Enable client certificate authentication
//   ca: [fs.readFileSync(path.join(__dirname, 'path/to/ca_certificate.pem'))], // Optionally provide a CA certificate to verify client certificates
// };

const options = {
  key: fs.readFileSync(path.join(__dirname, "certificate/private.key")),
  cert: fs.readFileSync(path.join(__dirname, "certificate/certificate.pem")),
  requestCert: true, // Enable client certificate authentication
  //   ca: [fs.readFileSync(path.join(__dirname, 'path/to/ca_certificate.pem'))], // Optionally provide a CA certificate to verify client certificates
};

// Handle client certificate authentication
app.use((req, res, next) => {
  if (req.client.authorized) {
    // Client certificate is valid
    console.log("Client certificate is valid");
    next();
  } else {
    // Client certificate is invalid or not provided
    console.log("Client certificate is invalid or not provided");
    res.status(401).send("Unauthorized");
  }
});

// Handle client requests
app.get("/api/data", (req, res) => {
  // Process the client request
  console.log("Received request from client");
  res.send("Response from server");
});

// Start the server
https.createServer(options, app).listen(443, () => {
  console.log("Server started on port 443");
});
