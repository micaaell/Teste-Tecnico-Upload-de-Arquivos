import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const API_URL = "http://localhost:3000/files";

  // Buscar arquivos do backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get(API_URL);
      setFiles(response.data);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload de arquivo
  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(API_URL, formData);
      alert("Arquivo enviado com sucesso!");
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar arquivo");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📁 Sistema de Upload de Arquivos</h1>

      {/* Upload */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleUpload}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>

      <hr />

      {/* Lista de arquivos */}
      <h2>📂 Arquivos enviados</h2>
      {files.length === 0 ? (
        <p>Nenhum arquivo enviado ainda.</p>
      ) : (
        <ul>
          {files.map((f) => (
            <li
              key={f.id}
              onClick={() => setSelectedFile(f)}
              style={{ cursor: "pointer", marginBottom: "5px" }}
            >
              {f.name} ({f.type})
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* Visualização */}
      {selectedFile && (
        <div>
          <h2>👁️ Visualização</h2>

          {selectedFile.type.includes("image") ? (
            <img
              src={selectedFile.url}
              alt={selectedFile.name}
              width="300"
            />
          ) : (
            <iframe
              src={selectedFile.url}
              width="600"
              height="400"
              title="PDF Viewer"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;