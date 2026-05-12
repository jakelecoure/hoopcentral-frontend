import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LeagueProvider } from './context/LeagueContext';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';
import { Games } from './pages/Games/Games';
import { GameDetail } from './pages/Games/GameDetail';
import { Teams } from './pages/Teams/Teams';
import { TeamDetail } from './pages/Teams/TeamDetail';
import { Players } from './pages/Players/Players';
import { PlayerDetail } from './pages/Players/PlayerDetail';
import { Standings } from './pages/Standings/Standings';

export default function App() {
  return (
    <BrowserRouter>
      <LeagueProvider>
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/games"         element={<Games />} />
          <Route path="/games/:id"     element={<GameDetail />} />
          <Route path="/teams"         element={<Teams />} />
          <Route path="/teams/:id"     element={<TeamDetail />} />
          <Route path="/players"       element={<Players />} />
          <Route path="/players/:id"   element={<PlayerDetail />} />
          <Route path="/standings"     element={<Standings />} />
        </Routes>
      </LeagueProvider>
    </BrowserRouter>
  );
}
