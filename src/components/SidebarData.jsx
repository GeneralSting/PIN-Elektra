import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

//popunjavanje sidebara nazivima za stranicu i njihovim putanjama
export const SidebarData = [
    {
        title: 'Kupci',
        path: '/Admin',
        icon: <IoIcons.IoIosPeople />
    },
    {
        title: 'Računi',
        path: '/Admin/Racuni',
        icon: <RiIcons.RiBillFill />,
    },
    {   
        title: 'Stornirani računi',
        path: '/Admin/Racuni/Stornirano',
        icon: <RiIcons.RiBillLine />
    },
    {
        title: 'Statistika',
        path: '/Admin/Statistika',
        icon: <IoIcons.IoIosStats />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: 'Top artikli',
                path: '/Admin/Statistika/Artikli/Najprodavaniji',
                icon: <RiIcons.RiBarChartFill />
            },
            {
                title: 'Kupac-račun',
                path: '/Admin/Statistika/racuni/Top10',
                icon: <RiIcons.RiBarChartGroupedFill />
            },
            {
                title: 'Kupac-artikl',
                path: '/Admin/Statistika/Artikli/Top10',
                icon: <RiIcons.RiBarChartGroupedFill />
            }
        ]
    },
    {
        title: 'Odjava',
        path: '/',
        icon: <IoIcons.IoIosLogOut />
    }
];