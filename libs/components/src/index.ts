import 'antd/dist/antd.css';
import 'react-aspect-ratio/aspect-ratio.css';
import './tailwind.css';
import './global.css';
import { initI18n } from '@bookaquest/utilities';

export function initCommons() {
  initI18n();
}

export * from './app/EscapeRoomCard';
export * from './app/WorkHours';

export * from './util/Time';
