import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import 'tui-calendar/dist/tui-calendar.css'
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-time-picker/dist/tui-time-picker.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initCommons from '~/../commons'
import App from './App'

initCommons()

// TODO: em size paddings
// TODO: translation extraction script
// TODO: backend using frontend's DTOs

ReactDOM.render(<App />, document.getElementById('root'))
