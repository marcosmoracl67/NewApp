import { useEffect, useState, useCallback  } from "react";
// DocumentUploader ahora necesita ser importado correctamente
// Asumiendo que está en pages/projects, ajusta la ruta si es necesario
import DocumentUploader from "../pages/projects/DocumentUploader";
import DocumentList from "../components/DocumentList";
import Loader from "./Loader"; // <<< Importar Loader
import Parrafo from "./Parrafo"; // <<< Importar Parrafo para mensaje de error
import PropTypes from 'prop-types'; // <-- Importar PropTypes

const DocumentManager = ({ tipo, id, idNodo }) => { 
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const targetId = idNodo || id;
  const targetType = idNodo ? 'nodo' : tipo; 

  const fetchDocumentos = useCallback(async () => { // <-- useCallback añadido aquí
    if (!targetId) { 
        setDocumentos([]); 
        setIsLoading(false); // Asegurar que isLoading sea false si no hay ID
        setError(null);
        return;
    }
    setIsLoading(true);
    setError(null); 
    setDocumentos([]); 

    try {
      let url;
      if (targetType === "proyecto") {
        url = `http://localhost:3000/api/documentos/proyecto?proyecto_id=${targetId}`;
      } else if (targetType === "tarea") {
        url = `http://localhost:3000/api/documentos/tarea?tarea_id=${targetId}`;
      } else if (targetType === "nodo") { 
        url = `http://localhost:3000/api/documentos/by-nodo/${targetId}`; 
      } else {
        throw new Error("Tipo de documento no especificado o no válido para carga.");
      }
      
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        let errorMsg = `Error ${res.status}: ${res.statusText}`;
        try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (parseError) {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setDocumentos(data);

    } catch (err) {
      console.error("❌ Error al cargar documentos:", err);
      setError(err.message || "No se pudieron cargar los documentos.");
      setDocumentos([]);
    } finally {
        setIsLoading(false);
    }
  }, [targetId, targetType]); // Dependencias de useCallback

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]); // Ahora depende de fetchDocumentos (que es estable por useCallback)

  const handleDocumentDeleted = useCallback((deletedId) => { // <-- useCallback añadido
      console.log(`Documento ${deletedId} eliminado, refrescando lista...`);
      fetchDocumentos(); 
  }, [fetchDocumentos]); // Depende de fetchDocumentos

  // ✅ AJUSTE CLAVE: Renderizar un mensaje si no hay targetId
  if (!targetId) {
      return (
          <Parrafo align="center" color="var(--text-muted-color)" padding="var(--spacing-lg)">
              Seleccione un nodo para gestionar sus adjuntos.
          </Parrafo>
      );
  }

  // Si targetId es válido, SIEMPRE intentar renderizar los componentes.
  // El Loader, Error y DocumentList (vacío) se encargarán de sus propios estados.
  return (
    <div className="document-manager">
      <DocumentUploader
        idNodo={idNodo} 
        proyectoId={!idNodo && tipo === "proyecto" ? id : null} 
        tareaId={!idNodo && tipo === "tarea" ? id : null}       
        onUpload={fetchDocumentos} 
      />

      <div className="document-list-section" style={{marginTop: '1.5rem'}}>
         {isLoading && <Loader text="Cargando documentos..." />}

         {error && !isLoading && (
            <Parrafo variant="error" role="alert">
                Error al cargar: {error}
            </Parrafo>
         )}

         {!isLoading && !error && ( // Modificación: !error para que no renderice la lista si hay error
            <DocumentList
                documentos={documentos}
                onDelete={handleDocumentDeleted} 
            />
          )}
      </div>
    </div>
  );
};

DocumentManager.propTypes = {
  id: PropTypes.number, 
  tipo: PropTypes.oneOf(['proyecto', 'tarea']), 
  idNodo: PropTypes.number, 
};

DocumentManager.defaultProps = {
  id: null,
  tipo: null,
  idNodo: null,
};

export default DocumentManager;