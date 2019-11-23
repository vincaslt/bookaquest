// import '@bookaquest/user-script';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initCommons } from '@bookaquest/components';
import App from './app/App';

initCommons();

ReactDOM.render(<App />, document.getElementById('root'));
