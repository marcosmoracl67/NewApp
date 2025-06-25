// --- START OF FILE components/DocumentList.jsx --- (REFACTORIZADO)
import axios from "axios";
import { useState } from "react"; // useEffect no se usa si no hay fetch aquí
import { FaTrashAlt, FaFileDownload } from "react-icons/fa";
import DataTable from "../components/DataTable";
import FormattedDate from "../components/FormattedDate";
import FormButton from "./FormButton"; // <<< Importar FormButton
import ConfirmDialog from "./ConfirmDialog"; // <<< Importar ConfirmDialog
import Tooltip from "../components/Tooltip"; // Si se usa Tooltip para botones

// Componente sigue recibiendo documentos y onDelete callback
const DocumentList = ({ documentos = [], onDelete }) => {
    const [notificacion, setNotificacion] = useState(null);
    // const [filtro, setFiltro] = useState(""); // Si la búsqueda se maneja en el padre, quitar filtro local
    const [sortColumn, setSortColumn] = useState("fecha_subida"); // Default sort?
    const [sortDirection, setSortDirection] = useState("desc"); // Default sort direction?
    const [itemAEliminar, setItemAEliminar] = useState(null); // Para ConfirmDialog
    const [loadingStates, setLoadingStates] = useState({}); // { 'download-12': true, 'delete-15': true }

    const mostrarNotificacion = (msg) => {
      setNotificacion(msg);
      setTimeout(() => setNotificacion(null), 3000);
    };

    // --- Función para manejar el estado de carga ---
    const setLoading = (action, id, isLoading) => {
        setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
    };

    const descargarDocumento = async (id, nombreOriginal) => {
        const loadingKey = `download-${id}`;
        if (loadingStates[loadingKey]) return; // Evitar doble clic

        setLoading('download', id, true);
        try {
          const res = await axios.get(`http://localhost:3000/api/documentos/${id}`, {
            responseType: "blob",
            withCredentials: true
          });

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nombreOriginal || `documento-${id}`); // Usar nombre original
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url); // Limpiar URL del objeto
        } catch (error) {
          mostrarNotificacion("Error al descargar documento ❌");
          console.error("Descarga fallida:", error.response?.data || error.message);
        } finally {
          setLoading('download', id, false);
        }
    };

  // Función para iniciar la eliminación (abre el diálogo)
  const iniciarEliminarDocumento = (doc) => {
      setItemAEliminar(doc); // Guarda el objeto completo o al menos el ID y nombre
  };

  // Función que se ejecuta al confirmar la eliminación
  const confirmarEliminarDocumento = async () => {
      if (!itemAEliminar) return;
      const id = itemAEliminar.documento_id;
      const loadingKey = `delete-${id}`;
      if (loadingStates[loadingKey]) return;

      setLoading('delete', id, true);
      try {
          await axios.delete(`http://localhost:3000/api/documentos/${id}`, {
              withCredentials: true
          });
          mostrarNotificacion("Documento eliminado ✅");
          if (onDelete) onDelete(id); // Llama al callback del padre para refrescar
      } catch (error) {
          mostrarNotificacion("Error al eliminar documento ❌");
          console.error("Eliminación fallida:", error.response?.data || error.message);
      } finally {
          setLoading('delete', id, false);
          setItemAEliminar(null); // Cierra el diálogo
      }
  };


    // --- Lógica de Filtrado y Ordenamiento ---
    // El filtrado podría hacerse en el componente padre si SearchBar está allí
    // const documentosFiltrados = documentos.filter((op) =>
    //   op.nombre.toLowerCase().includes(filtro.toLowerCase())
    // );

    // Ordenamiento
    const sortedDocumentos = [...documentos].sort((a, b) => { // Ordena directamente los documentos recibidos
        if (!sortColumn) return 0;
         let aVal, bVal;

         // Manejo especial para fechas
         if (sortColumn === 'fecha_subida') {
             aVal = new Date(a.fecha_subida);
             bVal = new Date(b.fecha_subida);
         } else {
             // Manejo para otras columnas (asumiendo string)
             aVal = a[sortColumn]?.toString().toLowerCase() ?? '';
             bVal = b[sortColumn]?.toString().toLowerCase() ?? '';
         }


        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // --- Nuevo handleSort ---
    const handleSort = (column) => {
        const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);
    };

  // Si no hay documentos (después de intentar cargar), muestra mensaje
  // Quitado el if (!documentos.length) return <p>...</p>; para mostrar la tabla vacía si es necesario

  return (
    <div className="document-list">
       {/* Notificación Toast (si se usa aquí) */}
       {notificacion && <div className="notification-toast">{notificacion}</div>}

       {/* Si se quiere mostrar mensaje de tabla vacía explícitamente */}
       {documentos.length === 0 && <p>No hay documentos para mostrar.</p>}

       {/* Renderizar DataTable solo si hay documentos o se quiere mostrar la cabecera vacía */}
      {documentos.length > 0 && (
          <DataTable
            rowIdKey="documento_id"
            data={sortedDocumentos} // Usa los datos ordenados
            columns={[
              {
                key: "nombre", // ✅ Esto es correcto según tu backend
                label: "Nombre",
                sortable: true,
                className: "col-60",
                render: (doc) => (
                  <Tooltip
                    content={
                      <>
                        <div><strong>Subido por:</strong> {doc.usuario_nombre || 'Desconocido'}</div>
                        <div><strong>Fecha:</strong> {new Date(doc.fecha_subida).toLocaleString()}</div>
                      </>
                    }
                    position="top-right"
                  >
                    <div className="fila-tooltip-wrapper">
                      {doc.nombre}
                    </div>
                  </Tooltip>
                )
              }, 
              { key: "fecha_subida", label: "Fecha Subida", sortable: true, className: "col-20",
                render: (row) => <FormattedDate date={row.fecha_subida} format="dd-mmm-yyyy" /> // Formato cambiado
              },
              { key: "acciones", label: "Acciones", className: "col-20 actions-column", // Clase para alinear
                    render: (row) => (
                            <div className="table-actions">
                              <FormButton
                                icon={<FaFileDownload />}
                                title="Descargar"
                                size="small"
                                variant="outline" // Variante diferente
                                onClick={() => descargarDocumento(row.documento_id, row.nombre)}
                                isLoading={loadingStates[`download-${row.documento_id}`]} // Estado de carga
                                disabled={loadingStates[`delete-${row.documento_id}`]} // Deshabilitar si se está borrando
                                loaderSize="small"
                              />
                              <FormButton
                                icon={<FaTrashAlt />}
                                title="Eliminar"
                                size="small"
                                variant="danger" // Variante estándar
                                onClick={() => iniciarEliminarDocumento(row)} // Llama a iniciar eliminación
                                isLoading={loadingStates[`delete-${row.documento_id}`]} // Estado de carga
                                disabled={loadingStates[`download-${row.documento_id}`]} // Deshabilitar si se está descargando
                                loaderSize="small"
                              />
                            </div> )
              }
            ]}
            // editable={false} // Ya es el default
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort} // <<< Usa el nuevo handleSort
          />
       )}

        {/* Diálogo de Confirmación */}
        <ConfirmDialog
            isOpen={!!itemAEliminar}
            title="Confirmar Eliminación"
            message={`¿Estás seguro de que deseas eliminar el documento "${itemAEliminar?.nombre}"?`} // Mensaje dinámico
            onConfirm={confirmarEliminarDocumento}
            onCancel={() => setItemAEliminar(null)}
            confirmText="Eliminar"
            confirmVariant="danger"
        />
    </div>
  );
};

export default DocumentList;