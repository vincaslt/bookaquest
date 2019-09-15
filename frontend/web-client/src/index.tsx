import 'tui-calendar/dist/tui-calendar.css'
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-time-picker/dist/tui-time-picker.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initCommons from '~/commons'
import App from './App'

initCommons()

ReactDOM.render(<App />, document.getElementById('root'))
