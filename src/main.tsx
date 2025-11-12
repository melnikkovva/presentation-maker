import ReactDOM from 'react-dom/client';
import { App } from './views/App';
import { Provider } from 'react-redux';
import { store } from './store'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}