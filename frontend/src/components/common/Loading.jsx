import React from 'react';

export default function Loading() {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
      <div style={{textAlign: 'center'}}>
        <div className="spinner" style={{width: 40, height: 40, border: '4px solid #eee', borderTop: '4px solid #ef1f55', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto'}} />
        <div style={{marginTop: 8, color: '#6b7280'}}>Chargement...</div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}
