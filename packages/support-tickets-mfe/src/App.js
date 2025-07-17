import React from 'react';

const App = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#E0E7FF', border: '2px dashed #4F46E5', borderRadius: '8px' }}>
      <h1 style={{ color: '#3730A3', fontSize: '1.5rem', fontWeight: 'bold' }}>
        -- Support Tickets Micro-Frontend --
      </h1>
      <p style={{ marginTop: '0.5rem', color: '#4338CA' }}>
        This entire blue box is being loaded dynamically from localhost:3001.
      </p>
    </div>
  );
};

export default App;