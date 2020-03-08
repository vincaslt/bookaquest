import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initCommons } from '@bookaquest/components';
import { App } from './app/App';
import { environment } from './environments/environment';

initCommons({ debug: !environment.production });

// TODO: em size paddings
// TODO: backend using frontend's DTOs

ReactDOM.render(<App />, document.getElementById('root'));
