import {DALPlayer} from './core/DALPlayer';
import {CaptionsPlugin} from './plugins/CaptionsPlugin';
import {PictureInPicturePlugin} from './plugins/PictureInPicturePlugin';
import {PlaybackSpeedPlugin} from './plugins/PlaybackSpeedPlugin';
import {LoopPlugin} from './plugins/LoopPlugin';
import {DownloadPlugin} from './plugins/DownloadPlugin';
import {AdsPlugin} from './plugins/AdsPlugin';

if (typeof window !== 'undefined') {
    const w = window as any;
    w.DALPlayer = DALPlayer;
    (DALPlayer as any).CaptionsPlugin = CaptionsPlugin;
    (DALPlayer as any).PictureInPicturePlugin = PictureInPicturePlugin;
    (DALPlayer as any).PlaybackSpeedPlugin = PlaybackSpeedPlugin;
    (DALPlayer as any).LoopPlugin = LoopPlugin;
    (DALPlayer as any).DownloadPlugin = DownloadPlugin;
    (DALPlayer as any).AdsPlugin = AdsPlugin;
}

export {DALPlayer, CaptionsPlugin, PictureInPicturePlugin, PlaybackSpeedPlugin, LoopPlugin, DownloadPlugin, AdsPlugin};
export default DALPlayer;