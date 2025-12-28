import { WTI } from '@wti/ui';
import '@wti/ui/style.css';
/* @refresh reload */
import { render } from 'solid-js/web';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

render(
  () => (
    <WTI
      spec={{
        type: 'openapi',
        url: '/petstore.json',
      }}
      theme="dark"
      locale="en"
    />
  ),
  root,
);
