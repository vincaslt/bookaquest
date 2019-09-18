import '../lib'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initCommons from '~/../commons'
import App from './App'

initCommons()

ReactDOM.render(<App />, document.getElementById('root'))
