import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import 'tailwindcss/dist/tailwind.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initCommons from '~/../commons'
import App from './App'

initCommons()

// TODO: em size paddings
// TODO: backend using frontend's DTOs

ReactDOM.render(<App />, document.getElementById('root'))
