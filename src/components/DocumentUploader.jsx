// src/components/DocumentUploader.jsx

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FaFilePdf, FaFileWord, FaFileExcel, FaTrash,
  FaFilePowerpoint, FaFileCsv, FaFileImage, FaFileAudio, FaFileVideo,
  FaFileAlt, FaFileCode, FaFileArchive,
  FaProjectDiagram,
  FaDownload,
  FaFile,
  FaEllipsisV
} from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

import axios from 'axios';
import clsx from 'clsx';
import Tooltip from './Tooltip';
import DropdownMenu from './DropdownMenu';
import Modal from './Modal';

const API_BASE_URL = 'http://localhost:3000';

const iconByMimeType = {
  // ... (tus mappings existentes de mime types específicos) ...
  'application/pdf': <FaFilePdf className="doc-icon pdf" />,
  'application/msword': <FaFileWord className="doc-icon word" />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FaFileWord className="doc-icon word" />,
  'application/vnd.ms-excel': <FaFileExcel className="doc-icon excel" />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FaFileExcel className="doc-icon excel" />,
  'application/vnd.ms-powerpoint': <FaFilePowerpoint className="doc-icon ppt" />,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': <FaFilePowerpoint className="doc-icon ppt" />,
  'application/vnd.ms-powerpoint.presentation.macroenabled.12': <FaFilePowerpoint className="doc-icon ppt" />, // .pptm
  'application/vnd.ms-project': <FaProjectDiagram className="doc-icon mpp" />, // .mpp
  'application/vnd.visio': <FaProjectDiagram className="doc-icon vsd" />, // .vsd

  'text/plain': <FaFileAlt className="doc-icon text" />,
  'text/csv': <FaFileCsv className="doc-icon csv" />,
};

const iconByExtension = {
  // ... (tus mappings existentes de extensiones) ...
  'txt': <FaFileAlt className="doc-icon text" />,
  'js': <FaFileCode className="doc-icon code" />,
  'cjs': <FaFileCode className="doc-icon code" />,
  'json': <FaFileCode className="doc-icon code" />,
  'html': <FaFileCode className="doc-icon code" />,
  'css': <FaFileCode className="doc-icon code" />,
  'zip': <FaFileArchive className="doc-icon archive" />,
  'rar': <FaFileArchive className="doc-icon archive" />,
  'gz': <FaFileArchive className="doc-icon archive" />,
  'ico': <FaFileImage className="doc-icon image" />,
  'mpp': <FaProjectDiagram className="doc-icon mpp" />,
  'vsd': <FaProjectDiagram className="doc-icon vsd" />,
  'pptm': <FaFilePowerpoint className="doc-icon ppt" />,
};

const DocumentUploader = ({ idNodo }) => {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorUpload, setErrorUpload] = useState(null);
  const [activeImageForZoom, setActiveImageForZoom] = useState(null);

  const fetchArchivos = useCallback(async () => {
    try {
      setErrorUpload(null);
      const url = `${API_BASE_URL}/api/documentos/by-nodo/${idNodo}`;
      console.log("Intentando GET a URL:", url);
      const response = await axios.get(url);
      setArchivos(Array.isArray(response.data) ? response.data : response.data.documentos || []);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      setErrorUpload(`Error al cargar documentos: ${error.response?.data?.error || error.message}`);
    }
  }, [idNodo]);

  const handleImageDoubleClick = (archivo) => {
    if (archivo.tipo && archivo.tipo.startsWith('image/')) {
      setActiveImageForZoom(archivo);
    }
  };

  const handleCloseZoomModal = () => {
    setActiveImageForZoom(null);
  };

  useEffect(() => {
    if (idNodo) {
      fetchArchivos();
    } else {
      setArchivos([]);
      setErrorUpload(null);
    }
  }, [idNodo, fetchArchivos]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setErrorUpload("No se seleccionó ningún archivo o el tipo/tamaño no es permitido.");
      return;
    }

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('idNodo', idNodo);

    try {
      setCargando(true);
      setErrorUpload(null);

      const postUrl = `${API_BASE_URL}/api/documentos/`;
      console.log("Intentando POST a URL:", postUrl);
      console.log("FormData a enviar:", Object.fromEntries(formData.entries()));

      await axios.post(postUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchArchivos();
    } catch (error) {
      console.error('Error al subir archivos:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || "Error desconocido al subir archivo.";
      setErrorUpload(`Error al subir archivo: ${errorMessage}`);
    } finally {
      setCargando(false);
    }
  }, [idNodo, fetchArchivos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const obtenerIcono = (archivo) => {
    const mime = archivo.tipo || '';
    const fileName = archivo.nombre || '';
    const extension = fileName.split('.').pop().toLowerCase();

    // Variable para el elemento visual (imagen o icono)
    let visualElement;

    // 1. Si es una imagen, mostrar la miniatura real
    if (mime.startsWith('image/')) {
        const imageUrl = `${API_BASE_URL}/api/documentos/display/${archivo.documento_id}`;
        visualElement = (
            <img
              src={imageUrl}
              alt={archivo.nombre}
              className="doc-thumbnail"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none'; // Oculta la imagen fallida
                const parent = e.target.parentNode;
                const fallbackIconDiv = document.createElement('div');
                fallbackIconDiv.className = 'doc-icon image';
                parent.appendChild(fallbackIconDiv);
              }}
            />
        );
    }
    // 2. Buscar coincidencia exacta por mimetype (documentos específicos)
    else if (iconByMimeType[mime]) {
      visualElement = iconByMimeType[mime];
    }
    // 3. Buscar por categorías amplias de mimetype (audio, video)
    else if (mime.startsWith('audio/')) {
      visualElement = <FaFileAudio className="doc-icon audio" />;
    }
    else if (mime.startsWith('video/')) {
      visualElement = <FaFileVideo className="doc-icon video" />;
    }
    // 4. Fallback a la extensión
    else if (iconByExtension[extension]) {
      visualElement = iconByExtension[extension];
    }
    // 5. Fallback final
    else {
      visualElement = <FaFile className="doc-icon default" />;
    }

    // <--- RENDERIZAR EL CONTENEDOR FINAL CON onDoubleClick CONDICIONAL ---
    return (
      <div
        className="doc-card__visual-area"
        // onDoubleClick solo si es una imagen
        onDoubleClick={mime.startsWith('image/') ? () => handleImageDoubleClick(archivo) : undefined}
        title={mime.startsWith('image/') ? "Doble click para ver imagen" : undefined}
      >
        {visualElement}
      </div>
    );
  };

  const eliminarArchivo = async (idDocumento) => {
    try {
      setErrorUpload(null);
      const deleteUrl = `${API_BASE_URL}/api/documentos/${idDocumento}`;
      console.log("Intentando DELETE a URL:", deleteUrl);
      await axios.delete(deleteUrl);
      await fetchArchivos();
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      setErrorUpload(`Error al eliminar archivo: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDownload = (documentoId, fileName) => {
    const downloadUrl = `${API_BASE_URL}/api/documentos/${documentoId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="docuploader-container">
      {!idNodo && (
        <p className="text-warning" style={{ textAlign: 'center', padding: '10px' }}>
          Seleccione un nodo para subir y ver documentos adjuntos.
        </p>
      )}

      {idNodo && (
        <>
          <div {...getRootProps({ className: clsx('dropzone', { 'dropzone--active': isDragActive }) })}>
            <input {...getInputProps()} />
            <MdCloudUpload className="drop-icon" />
            <p>{isDragActive ? 'Suelta los archivos aquí...' : 'Haz clic o arrastra archivos aquí'}</p>
          </div>

          {cargando && <p className="text-info">Subiendo archivos...</p>}
          {errorUpload && <p className="text-danger" style={{ textAlign: 'center', padding: '10px' }}>{errorUpload}</p>}

          <div className="doc-preview-grid">
            {archivos.length === 0 && !cargando && !errorUpload && (
              <p className="text-muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                No hay documentos adjuntos para este nodo.
              </p>
            )}
            {archivos.map((archivo) => (
              <Tooltip
                key={archivo.documento_id}
                position="up-right"
                showDelay={300}
                hideDelay={100}
                content={
                  <div className="tooltip-doc-info">
                    <p>Subido por: <strong>{archivo.usuario_nombre || 'Desconocido'}</strong></p>
                    <p>Fecha: <strong>{new Date(archivo.fecha_subida).toLocaleDateString()}</strong></p>
                  </div>
                }
              >
                <div className="doc-card">
                  <div className="doc-card__actions-menu">
                    <DropdownMenu
                    trigger={
                      <button className="btn-icon-more-options" aria-label="Más opciones">
                        <FaEllipsisV />
                      </button>
                    }
                    placement="bottom-end"
                    items={[
                      { label: 'Descargar', icon: <FaDownload />, onClick: () => handleDownload(archivo.documento_id, archivo.nombre) },
                      { label: 'Eliminar', icon: <FaTrash />, onClick: () => eliminarArchivo(archivo.documento_id), className: 'dropdown-menu__item--danger' },
                    ]}
                  />
                  </div>
                  {obtenerIcono(archivo)}
                  <p className="doc-name">{archivo.nombre}</p>

                </div>
              </Tooltip>
            ))}
          </div>
        </>
      )}

      {/* --- MODAL PARA ZOOM DE IMAGEN --- */}
      {activeImageForZoom && (
        <Modal
          isOpen={!!activeImageForZoom}
          title={activeImageForZoom.nombre}
          onClose={handleCloseZoomModal}
          width={85}
          showCloseButton={true}
          bodyCentered={true}
        >
          <div className="image-zoom-container">
            <img
              src={`${API_BASE_URL}/api/documentos/display/${activeImageForZoom.documento_id}`}
              alt={activeImageForZoom.nombre}
              className="image-zoom-display"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/placeholder-image-error.png';
              }}
            />
          </div>
        </Modal>
      )}
      {/* --- FIN MODAL PARA ZOOM DE IMAGEN --- */}
    </div>
  );
};

export default DocumentUploader;