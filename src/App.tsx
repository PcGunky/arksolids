import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useDinoStore } from './store/useDinoStore';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { MasterList } from './components/MasterList';
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
          <Route index element={
            <div className="min-h-screen bg-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  Ark Ascended Dino Tracker
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">All Dinos</h2>
                    <MasterList />
                  </div>
                  <div className="lg:col-span-2">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Collection</h2>
                    <Collection />
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/share/:identifier" element={<SharedCollection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;