import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useDinoStore } from './store/useDinoStore';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Collection } from './components/Collection';
import { SharedCollection } from './components/SharedCollection';
import { supabase } from './lib/supabase';

function App() {
  const user = useAuthStore((state) => state.user);
  const loadCollection = useDinoStore((state) => state.loadCollection);

  useEffect(() => {
    if (user) {
      loadCollection();
    }
  }, [user, loadCollection]);

  // Allow access to shared collections without authentication
  if (window.location.pathname.startsWith('/share/')) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/share/:identifier" element={<SharedCollection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Collection />} />
          <Route path="/share/:identifier" element={<SharedCollection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;