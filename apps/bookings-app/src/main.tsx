import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initCommons } from '@bookaquest/components';
import App from './app/App';
import { environment } from './environments/environment';

initCommons({ debug: !environment.production });

ReactDOM.render(<App />, document.getElementById('root'));
