/* @refresh reload */
import { render } from 'solid-js/web';
import { WTI } from '@wti/ui';

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
  root
);
