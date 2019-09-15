import 'antd/dist/antd.css'
import 'react-aspect-ratio/aspect-ratio.css'

import i18next from 'i18next'
import initI18n from './utils/i18n'

function initCommons() {
  initI18n(i18next)
}

export default initCommons