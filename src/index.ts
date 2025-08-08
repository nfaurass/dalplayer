import {DALPlayer} from './core/DALPlayer';

if (typeof window !== 'undefined') (window as any).DALPlayer = DALPlayer;

export default DALPlayer;