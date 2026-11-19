import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { CreateVideo } from './pages/CreateVideo';
import { Playground } from './pages/Playground';
import { Explore } from './pages/Explore';
import { Creations } from './pages/Creations';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="studio" element={<CreateVideo />} />
          <Route path="playground" element={<Playground />} />
          <Route path="explore" element={<Explore />} />
          <Route path="creations" element={<Creations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
