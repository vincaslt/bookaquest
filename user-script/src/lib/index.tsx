import 'bootstrap/dist/css/bootstrap.css' // TODO: make custom styles instead of bootstrap
import { h, render } from 'preact'
import Form from 'react-jsonschema-form'

render(
  <Form
    schema={{
      title: 'Todo',
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', title: 'Title', default: 'A new task' },
        done: { type: 'boolean', title: 'Done?', default: false }
      }
    }}
    onChange={(...rest) => console.log('changed', rest)}
    onSubmit={(...rest) => console.log('submitted', rest)}
    onError={(...rest) => console.log('errors', rest)}
  />,
  document.getElementById('bm-form-root')!
)
