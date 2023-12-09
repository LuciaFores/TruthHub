import { Theme,
        Button } from 'react-daisyui';
import './App.css';

function App() {
  return (
    <div>
      <Theme dataTheme="synthwave">
        <Button color="primary">Click me, dark!</Button>
      </Theme>

      <Theme dataTheme="light">
      <Button color="primary">Click me, light!</Button>
      </Theme>
    </div>
  );
}

export default App;
