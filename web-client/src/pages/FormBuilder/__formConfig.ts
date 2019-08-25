import { FormConfig } from './lib/index'

const dummyConfig: FormConfig = {
  uiSchema: {
    timeslot: {
      'ui:field': 'timeslot'
    }
  },
  schema: {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      name: {
        type: 'string',
        title: 'First name',
        default: 'Chuck'
      },
      participants: {
        type: 'integer',
        title: 'Participants'
      },
      timeslot: {
        type: 'object',
        title: 'Timeslot',
        required: ['timeslots'],
        properties: {
          startTime: {
            type: 'string'
          },
          endTime: {
            type: 'string'
          }
        }
      }
    }
  }
}

export default dummyConfig
