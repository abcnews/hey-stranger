import 'regenerator-runtime/runtime';
import { requestDOMPermit } from '@abcnews/env-utils';
import { h, render } from 'preact';
import App from './components/App';
import './global.css';
import './unveil';
import { fetchProps } from './utils';

requestDOMPermit('page').then(async () => {
  // Load supplementary article and parse props from it
  const props = await fetchProps();

  // Set viewport
  document
    .querySelector('meta[name="viewport"]')
    .setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

  // Remove existing global styles
  [...document.querySelectorAll('link[rel="stylesheet"][data-chunk]')].forEach(x =>
    x.parentElement.removeChild(x)
  );

  // Get app root element
  const rootEl = document.querySelector('[data-component="Decoy"][data-key="page"]');

  // Render app
  rootEl.innerHTML = '';
  render(<App meta={props.meta} scene={props.scene} />, rootEl, rootEl.firstChild);

  // Notify page the app is ready (for unveiling)
  window.dispatchEvent(new CustomEvent('hey-stranger:ready'));
});

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
