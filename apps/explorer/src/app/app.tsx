import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext, useThemeSwitcher } from '@vegaprotocol/react-helpers';
import { EnvironmentProvider, NetworkLoader } from '@vegaprotocol/environment';
import { NetworkInfo } from '@vegaprotocol/network-info';
import { Nav } from './components/nav';
import { Header } from './components/header';
import { Main } from './components/main';
import { TendermintWebsocketProvider } from './contexts/websocket/tendermint-websocket-provider';
import type { InMemoryCacheConfig } from '@apollo/client';

function App() {
  const [theme, toggleTheme] = useThemeSwitcher();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const cacheConfig: InMemoryCacheConfig = {};

  return (
    <ThemeContext.Provider value={theme}>
      <TendermintWebsocketProvider>
        <NetworkLoader cache={cacheConfig}>
          <div
            className={`${
              menuOpen && 'h-[100vh] overflow-hidden'
            } antialiased m-0 bg-white dark:bg-black text-black dark:text-white`}
          >
            <div className="grid grid-rows-[repeat(2,_auto)_1fr] grid-cols-[1fr] md:grid-rows-[auto_minmax(700px,_1fr)] md:grid-cols-[300px_1fr] border-neutral-700 dark:border-neutral-300 lg:border-l lg:border-r mx-auto">
              <Header
                theme={theme}
                toggleTheme={toggleTheme}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
              />
              <Nav menuOpen={menuOpen} />
              <Main />
              <footer className="grid grid-rows-2 grid-cols-[1fr_auto] text-sm md:text-md md:flex md:col-span-2 p-4 gap-4 border-t border-neutral-700 dark:border-neutral-300">
                <NetworkInfo />
              </footer>
            </div>
          </div>
        </NetworkLoader>
      </TendermintWebsocketProvider>
    </ThemeContext.Provider>
  );
}

const Wrapper = () => {
  return (
    <EnvironmentProvider>
      <App />
    </EnvironmentProvider>
  );
};

export default Wrapper;
