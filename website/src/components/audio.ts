import { modernCard, span, custom, Grid, draw } from '@lucsoft/webgen';
import { registerEvent } from '../data/eventListener';

export const renderAudio = () => {

    const shell = span(undefined)

    const list = (last = 'Not Connected', dB = 'Not Connected', duration = 'Not Connected') => draw(Grid({ minColumnWidth: 5 },
        modernCard({
            title: last,
            description: 'Last Time',
            subtitle: 'Last time AirPods were used'
        }),
        modernCard({
            title: dB,
            description: 'Average dB',
            subtitle: 'Average audiovolume today'
        }),
        modernCard({
            title: duration,
            description: 'Duration',
            subtitle: 'Time listened with AirPods'
        })));
    shell.innerHTML = "";
    shell.append(list());

    registerEvent((data: any) => {
        shell.innerHTML = "";
        shell.append(list(data.audio.last, data.audio.dB, data.audio.duration));
    }, 'audio')
    return shell;
}
