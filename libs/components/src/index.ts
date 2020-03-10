import 'antd/dist/antd.css';
import './tailwind.css';
import './global.css';
import { initI18n } from '@bookaquest/utilities';

export const initCommons = initI18n;

export * from './app/EscapeRoomCard';
export * from './app/WorkHours';
export * from './app/DifficultyIndicator';

export * from './util/Time';
