import { render } from 'preact';
import { App } from './App';
import './styles/main.css';
const container = document.getElementById('root');
if (!container) {
    throw new Error('Mount element #root not found.');
}
render(<App />, container);
