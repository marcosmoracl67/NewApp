// src/components/Tabs.jsx
import { useId, useCallback, useRef } from 'react';
import '../styles/index.css'; 

const Tabs = ({
  tabsConfig,
  activeTabId,
  onTabChange,
  variant = 'line',
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
  ariaLabel,
  ...rest
}) => {
  const baseId = useId();
  const tabListRef = useRef(null);

  // <<< CORRECCIÓN AQUÍ: Declarar handleTabClick como const >>>
  const handleTabClick = (tabId, isDisabled) => {
    if (!isDisabled) {
      onTabChange(tabId);
    }
  };

  // Manejo de Teclado
  const handleKeyDown = useCallback((event) => {
    if (!tabListRef.current) return;

    const tabs = Array.from(tabListRef.current.querySelectorAll('[role="tab"]:not([disabled])'));
    const currentFocusedTabId = document.activeElement?.id;
    let currentIndex = tabs.findIndex(tab => tab.id === currentFocusedTabId);

    if (currentIndex === -1) {
        currentIndex = tabs.findIndex(tab => tab.id === `${baseId}-tab-${activeTabId}`);
    }
    if (currentIndex === -1 && tabs.length > 0) {
        currentIndex = 0;
    }

    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = tabs.length - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (document.activeElement?.getAttribute('role') === 'tab') {
        event.preventDefault();
        const focusedTabId = document.activeElement.dataset.tabId;
        if (focusedTabId && !document.activeElement.disabled) {
            // Llamar a handleTabClick para mantener la lógica centralizada si es necesario
            // o directamente onTabChange. Por simplicidad, onTabChange es suficiente aquí.
            onTabChange(focusedTabId);
        }
      }
    } else {
      return;
    }

    if (tabs[nextIndex] && tabs[nextIndex] !== document.activeElement) {
      tabs[nextIndex].focus();
    }
  }, [activeTabId, baseId, onTabChange]);


  return (
    <div className={`tabs tabs--variant-${variant} ${className}`} {...rest}>
      <div
        ref={tabListRef}
        className={`tabs__list ${tabListClassName}`}
        role="tablist"
        aria-label={ariaLabel || 'Navegación por pestañas'}
        onKeyDown={handleKeyDown}
      >
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            className={`tabs__tab ${activeTabId === tab.id ? 'tabs__tab--active' : ''} ${tab.disabled ? 'tabs__tab--disabled' : ''}`}
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-selected={activeTabId === tab.id}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            onClick={() => handleTabClick(tab.id, tab.disabled)} // Uso correcto
            disabled={tab.disabled}
            data-tab-id={tab.id}
          >
            {tab.icon && <span className="tabs__tab-icon">{tab.icon}</span>}
            <span className="tabs__tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {tabsConfig.map((tab) => (
        <div
          key={`${baseId}-panel-${tab.id}`}
          className={`tabs__panel ${tabPanelClassName}`}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          tabIndex={0}
          hidden={activeTabId !== tab.id}
        >
          {activeTabId === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;