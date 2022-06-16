// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ThemeContext, useThemeSwitcher } from '@vegaprotocol/react-helpers';

export function App() {
  const [theme, toggleTheme] = useThemeSwitcher();

  return (
    <div className="antialiased m-0 bg-white dark:bg-black text-black dark:text-white h-full">
      <ThemeContext.Provider value={theme}>
        <section>
          <h1 className="uppercase calt mb-2 font-alpha text-h3">Transfers</h1>
        </section>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
