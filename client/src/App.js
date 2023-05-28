import CertificateForm from './components/CertificateForm/CertificateForm';
import LoginForm from './components/LoginForm/LoginForm';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CertificateForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
