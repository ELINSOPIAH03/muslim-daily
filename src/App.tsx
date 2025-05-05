import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Feedback = lazy(() => import('./pages/Feedback'));
const AlQuran = lazy(() => import('./pages/Alquran/Index'));
const AlMatsurat = lazy(() => import('./pages/Almatsurat/Index'));
const DzikirPagi = lazy(() => import('./pages/Almatsurat/Pagi'));
const DzikirPetang = lazy(() => import('./pages/Almatsurat/Petang'));
const SurahDetail = lazy(() => import('./pages/Alquran/SurahDetail'));
const JuzDetail = lazy(() => import('./pages/Alquran/JuzDetail'));
function App() {


  return (
    <>
      <Suspense fallback={<div>Loading Dulu Gois...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/al-quran" element={<AlQuran />} />
        <Route path="/al-matsurat" element={<AlMatsurat />} />
        <Route path="/al-matsurat/pagi" element={<DzikirPagi />} />
        <Route path="/al-matsurat/petang" element={<DzikirPetang />} />
        <Route path="/surah/:id" element={<SurahDetail />} />
        <Route path="/juz/:id" element={<JuzDetail />} />
      </Routes>
    </Suspense>
    </>
  )
}

export default App
