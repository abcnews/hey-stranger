const { h, render } = require('preact');
const { getProps, reset } = require('./utils');

const metaEl = document.querySelector('meta[name="dynamic-content"]');

if (!metaEl) {
  throw new Error('dynamic-content is not specified in meta');
}

let props;

function load() {
  const App = require('./components/App');
  render(<App meta={props.meta} scene={props.scene} />, document.body, document.body.firstChild);
}

(async () => {
  props = await getProps(metaEl.getAttribute('content'));
  reset();
  load();
  window.dispatchEvent(new CustomEvent('unveil'));
})();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      load();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');
      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
