import { draw, Grid, modernCard, span } from '@lucsoft/webgen';
import { registerEvent } from '../data/eventListener';

import '../styles/devices.css';
let activityData: [ string, string, string, string ][] = [
]

export const renderActivites = () => {

    const shell = span(undefined)

    const list = () => draw(Grid({},
        ...activityData.map(data => {
            return modernCard({
                title: data[ 0 ],
                description: data[ 1 ],
                subtitle: data[ 2 ],
                icon: data[ 3 ]
            })
        })));
    shell.innerHTML = "";
    shell.append(list());
    registerEvent((data: any) => {
        activityData = data.discord[ 0 ].filter((x: any) => x.name != "Custom Status" && x.name != "Spotify")
            .map((data: any) => [
                data.name,
                data.details ? data.details + (data.state != null ? ' - ' + data.state : '') : data.type.toLowerCase(),
                new Date(data.timestamps ? data.timestamps.start ? data.timestamps.start : data.timestamps.end ? data.timestamps.end : 0 : 0).toLocaleString(),
                data.applicationID && data.assets ? `https://cdn.discordapp.com/app-assets/${data.applicationID}/${(data.assets.smallImage == null) ? data.assets.largeImage : data.assets.smallImage}.png` : ''
            ]);
        shell.innerHTML = "";
        shell.append(list())

    }, 'discord')
    return shell;
}
