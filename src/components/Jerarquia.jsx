// Jeraquia.jsx
import React from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaChevronRight, FaChevronDown } from 'react-icons/fa';
// Importar tus componentes: Card, FormButton, iconos de tipo de nodo, etc.

const Jeraquia = React.memo(({
  node,         // El objeto de datos completo para este nodo
  level,
  isExpanded,
  isSelected,
  childNodes,   // Array de objetos de datos para los hijos directos de este nodo
  getIconForNodeType,
  onToggleExpand,
  onSelectNode,
  onEditNode,
  onAddChildNode,
  onDeleteNode,
  // ... otros callbacks necesarios ...
}) => {

  const handleExpandClick = (e) => {
    e.stopPropagation(); // Evita que el clic en el expansor también seleccione el nodo si están superpuestos
    onToggleExpand(node.id);
  };

  const handleNodeClick = () => {
    onSelectNode(node.id);
  };

  const nodeIcon = getIconForNodeType(node.type);
  const hasChildren = childNodes && childNodes.length > 0;

  return (
    <div className={`hierarchy-node level-${level} ${isSelected ? 'selected' : ''}`}>
      <div className="node-content" onClick={handleNodeClick}>
        {/* Indentación y Línea (simple con CSS) */}
        <span className="node-indent" style={{ paddingLeft: `${level * 20}px` }}></span>

        {/* Expansor */}
        {hasChildren ? (
          <button onClick={handleExpandClick} className="node-expander">
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        ) : (
          <span className="node-expander-placeholder"></span> // Para alinear
        )}

        {/* Icono de Tipo */}
        {nodeIcon && <span className="node-type-icon">{nodeIcon}</span>}

        {/* Descripción y Ubicación */}
        <span className="node-description">{node.description}</span>
        {node.technicalLocation && <span className="node-tech-loc">({node.technicalLocation})</span>}

        {/* Botones de Acción (podrían aparecer al hover o si está seleccionado) */}
        {isSelected && (
          <div className="node-actions">
            <button onClick={() => onEditNode(node)} title="Editar"><FaEdit /></button>
            <button onClick={() => onAddChildNode(node)} title="Añadir Hijo"><FaPlus /></button>
            <button onClick={() => onDeleteNode(node)} title="Eliminar"><FaTrashAlt /></button>
          </div>
        )}
      </div>

      {/* Hijos Recursivos */}
      {isExpanded && hasChildren && (
        <div className="node-children">
          {childNodes.map(childNode => (
            <Jeraquia
              key={childNode.id}
              node={childNode}
              level={level + 1}
              isExpanded={childNode.isExpanded} // Necesitarías pasar esto desde el estado central
              isSelected={childNode.isSelected} // También desde el estado central
              childNodes={childNode.children}   // Si la estructura ya está anidada
                                               // o se obtienen del map central en HierarchyView
              getIconForNodeType={getIconForNodeType}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              onEditNode={onEditNode}
              onAddChildNode={onAddChildNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default Jeraquia;