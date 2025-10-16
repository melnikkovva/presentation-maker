import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { addPresentationChangeHandler, getPresentation } from './store/editor';

const root = ReactDOM.createRoot(document.getElementById('root')!);

function render() {
    root.render(
        <React.StrictMode>
            <App presentation={getPresentation()} />
        </React.StrictMode>
    );
}

addPresentationChangeHandler(render);
render();