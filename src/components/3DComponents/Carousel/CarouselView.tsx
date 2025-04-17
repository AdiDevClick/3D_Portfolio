import Carousel from '@/components/3DComponents/Carousel/Carousel.tsx';
import { useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router';

export function CarouselView() {
    const { reducer, responsiveBoundaries, JSONDatas, SETTINGS } =
        useOutletContext();
    const location = useLocation();

    return (
        <Carousel
            reducer={reducer}
            boundaries={responsiveBoundaries}
            datas={JSONDatas}
            SETTINGS={SETTINGS}
            key={location.pathname}
        />
    );
}
