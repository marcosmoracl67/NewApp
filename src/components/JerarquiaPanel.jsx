// src/components/jerarquia/JerarquiaPanel.jsx
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ResizablePanel from '../components/ResizablePanel';
import JerarquiaManager from '../pages/hierarchy/JerarquiaManager';
import Container from '../components/Container';

const JerarquiaPanel = ({ idNodoRaiz = 0, onNodoSeleccionado }) => {
  const jerarquiaRef = useRef();
  const [nodoIdSeleccionado, setNodoIdSeleccionado] = useState(null);

  // Emitir selección
  const handleNodoSeleccionado = useCallback(
    (nodo) => {
      setNodoIdSeleccionado(nodo.IdNodo ?? nodo.id ?? null);
      if (onNodoSeleccionado) onNodoSeleccionado(nodo);
    },
    [onNodoSeleccionado]
  );
  return (
    <ResizablePanel initialWidth={320} minWidth={250} maxWidth={700} side="left">
      <Container as="section" className="jerarquia-manager" padding="0">
        <Container className="jerarquia-manager__acciones-globales">
 
        </Container>
        <JerarquiaManager
          ref={jerarquiaRef}
          nodoIdRaiz={idNodoRaiz}
          nodoIdSeleccionadoExternamente={nodoIdSeleccionado}
          onNodoSeleccionado={handleNodoSeleccionado}
        />
      </Container>
    </ResizablePanel>
  );
};

JerarquiaPanel.propTypes = {
  idNodoRaiz: PropTypes.number,
  onNodoSeleccionado: PropTypes.func,
};

export default JerarquiaPanel;
