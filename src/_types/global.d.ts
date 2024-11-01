import { Episode, Season, SeriesMedia } from '@prisma/client';
import { ReactElement } from 'react';
import { FileInfo } from './prisma';

declare global {
    interface IMenuItem {
        id: string;
        label: string;
        icon?: ReactNode;
        url: string;
        subMenu?: IMenuItem[];
    }

    interface AnchorEl {
        id: string;
        anchorEl: HTMLElement;
    }

    interface FullSeries extends SeriesMedia{
        seasons: FullSeason[]
    }

    interface FullSeason extends Season{
        episodes: Episode[]
    }

    type FileSrc = {
        src: string;
        file: File | FileInfo;
    }
}
