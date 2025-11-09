import { useState } from 'react';
import './debug.scss';

export default function DebugDemo() {
  const [count, setCount] = useState(0);

  const testError = () => {
    console.error('❌ Ceci est une erreur de test');
  };

  const testWarning = () => {
    console.warn('⚠️ Ceci est un avertissement');
  };

  const testInfo = () => {
    console.info('ℹ️ Information de debug');
  };

  const testLog = () => {
    console.log('📝 Log normal', { count, timestamp: new Date().toISOString() });
  };

  const testObject = () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      roles: ['admin', 'user'],
      settings: {
        theme: 'dark',
        notifications: true
      }
    };
    console.log('👤 Objet utilisateur:', user);
  };

  const testMultipleLogs = () => {
    console.log('1️⃣ Premier log');
    console.warn('2️⃣ Warning intermédiaire');
    console.error('3️⃣ Erreur finale');
  };

  const testThrowError = () => {
    throw new Error('💥 Erreur lancée pour tester ErrorBoundary!');
  };

  const testPromiseError = () => {
    Promise.reject('⚡ Promise rejetée - erreur async');
  };

  return (
    <div className="debug-demo">
      <div className="demo-header">
        <h1>🐛 Tracy-like Debug Panel Demo</h1>
        <p>Teste les différents types de logs et erreurs</p>
      </div>

      <div className="demo-content">
        <div className="demo-section">
          <h2>📊 Console Logs</h2>
          <div className="button-grid">
            <button onClick={testError} className="btn btn-error">
              🔴 Test Error
            </button>
            <button onClick={testWarning} className="btn btn-warning">
              ⚠️ Test Warning
            </button>
            <button onClick={testInfo} className="btn btn-info">
              ℹ️ Test Info
            </button>
            <button onClick={testLog} className="btn btn-log">
              📝 Test Log
            </button>
            <button onClick={testObject} className="btn btn-object">
              👤 Test Object
            </button>
            <button onClick={testMultipleLogs} className="btn btn-multiple">
              📚 Multiple Logs
            </button>
          </div>
        </div>

        <div className="demo-section">
          <h2>💥 Erreurs Runtime</h2>
          <div className="button-grid">
            <button onClick={testThrowError} className="btn btn-danger">
              💣 Throw Error (ErrorBoundary)
            </button>
            <button onClick={testPromiseError} className="btn btn-danger">
              ⚡ Promise Rejection
            </button>
          </div>
          <p className="demo-warning">
            ⚠️ Ces boutons vont déclencher de vraies erreurs
          </p>
        </div>

        <div className="demo-section">
          <h2>🔢 Counter de Test</h2>
          <div className="counter-section">
            <button onClick={() => setCount(count - 1)} className="btn btn-secondary">
              -
            </button>
            <span className="counter-value">{count}</span>
            <button onClick={() => setCount(count + 1)} className="btn btn-secondary">
              +
            </button>
          </div>
          <button 
            onClick={() => {
              console.log(`Counter value: ${count}`);
              if (count > 10) {
                console.warn('Counter is getting high!');
              }
              if (count > 20) {
                console.error('Counter is too high!');
              }
            }} 
            className="btn btn-primary"
          >
            📊 Log Counter Value
          </button>
        </div>

        <div className="demo-info">
          <h3>📖 Comment utiliser le Debug Panel</h3>
          <ul>
            <li>🐛 Clique sur le bouton flottant en bas à droite</li>
            <li>🔍 Filtre les logs par type (All, Errors, Warnings, Info, Logs)</li>
            <li>🗑️ Efface tous les logs avec le bouton poubelle</li>
            <li>✅ Le panel apparaît <strong>uniquement en développement</strong></li>
            <li>📱 Responsive et s'adapte aux petits écrans</li>
          </ul>

          <h3>🎨 Fonctionnalités</h3>
          <ul>
            <li>✅ Capture automatique de console.log/warn/error/info</li>
            <li>✅ Affiche les erreurs non gérées (throw new Error)</li>
            <li>✅ Capture les Promise rejections</li>
            <li>✅ Affichage des objets en JSON</li>
            <li>✅ Timestamps pour chaque log</li>
            <li>✅ Compteurs d'erreurs et warnings</li>
            <li>✅ Style Tracy-like avec dégradés violets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
