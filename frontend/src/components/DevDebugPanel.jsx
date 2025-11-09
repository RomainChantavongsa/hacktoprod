import { useState, useEffect } from 'react';
import './DevDebugPanel.css';

/**
 * DevDebugPanel - Équivalent de Tracy pour React
 * Affiche les erreurs, warnings, et informations de debug en bas à droite
 */
export default function DevDebugPanel() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, error, warn, info, log

  useEffect(() => {
    // Seulement en développement (basé sur VITE_NODE_ENV)
    if (import.meta.env.VITE_NODE_ENV === 'production') return;

    // Intercepter console.error, console.warn, console.log
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalInfo = console.info;

    const addLog = (type, args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [
        { id: Date.now() + Math.random(), type, message, timestamp, args },
        ...prev
      ].slice(0, 100)); // Garder seulement les 100 derniers logs
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addLog('warn', args);
    };

    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog('log', args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addLog('info', args);
    };

    // Intercepter les erreurs non gérées
    const handleError = (event) => {
      addLog('error', [event.error?.message || event.message]);
    };

    const handleUnhandledRejection = (event) => {
      addLog('error', [`Promise rejected: ${event.reason}`]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      console.info = originalInfo;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const filteredLogs = logs.filter(log => 
    filter === 'all' || log.type === filter
  );

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  // Ne pas afficher en production (basé sur VITE_NODE_ENV)
  if (import.meta.env.VITE_NODE_ENV === 'production') return null;

  return (
    <>
      {/* Bouton flottant */}
      <div className="dev-debug-fab" onClick={() => setIsOpen(!isOpen)}>
        <span className="dev-debug-icon">🐛</span>
        {errorCount > 0 && (
          <span className="dev-debug-badge error">{errorCount}</span>
        )}
        {warnCount > 0 && errorCount === 0 && (
          <span className="dev-debug-badge warn">{warnCount}</span>
        )}
      </div>

      {/* Panel */}
      {isOpen && (
        <div className="dev-debug-panel">
          {/* Header */}
          <div className="dev-debug-header">
            <div className="dev-debug-title">
              🐛 Debug Panel <span className="dev-debug-env">DEV</span>
            </div>
            <div className="dev-debug-actions">
              <button 
                className="dev-debug-btn"
                onClick={() => setLogs([])}
                title="Effacer les logs"
              >
                🗑️
              </button>
              <button 
                className="dev-debug-btn"
                onClick={() => setIsOpen(false)}
                title="Fermer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="dev-debug-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({logs.length})
            </button>
            <button
              className={`filter-btn error ${filter === 'error' ? 'active' : ''}`}
              onClick={() => setFilter('error')}
            >
              Errors ({errorCount})
            </button>
            <button
              className={`filter-btn warn ${filter === 'warn' ? 'active' : ''}`}
              onClick={() => setFilter('warn')}
            >
              Warnings ({warnCount})
            </button>
            <button
              className={`filter-btn info ${filter === 'info' ? 'active' : ''}`}
              onClick={() => setFilter('info')}
            >
              Info ({logs.filter(l => l.type === 'info').length})
            </button>
            <button
              className={`filter-btn log ${filter === 'log' ? 'active' : ''}`}
              onClick={() => setFilter('log')}
            >
              Logs ({logs.filter(l => l.type === 'log').length})
            </button>
          </div>

          {/* Logs */}
          <div className="dev-debug-content">
            {filteredLogs.length === 0 ? (
              <div className="dev-debug-empty">
                {filter === 'all' 
                  ? '✅ Aucun log pour le moment'
                  : `Aucun log de type "${filter}"`
                }
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className={`dev-debug-log ${log.type}`}>
                  <div className="log-header">
                    <span className="log-icon">
                      {log.type === 'error' && '🔴'}
                      {log.type === 'warn' && '⚠️'}
                      {log.type === 'info' && 'ℹ️'}
                      {log.type === 'log' && '📝'}
                    </span>
                    <span className="log-type">{log.type.toUpperCase()}</span>
                    <span className="log-timestamp">{log.timestamp}</span>
                  </div>
                  <pre className="log-message">{log.message}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
