import React, { createContext, useContext } from 'react';
import type { ReducerType } from '@/hooks/reducers/carouselTypes';
import type { SettingsType } from '@/configs/3DCarouselSettingsTypes';

interface CarouselContextType {
    reducer: ReducerType;
    responsiveBoundaries: any;
    JSONDatas: any;
    SETTINGS: SettingsType;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

export const useCarouselContext = () => {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error(
            'useCarouselContext must be used within a CarouselProvider'
        );
    }
    return context;
};

export const CarouselProvider: React.FC<{
    children: React.ReactNode;
    value: CarouselContextType;
}> = ({ children, value }) => {
    return (
        <CarouselContext.Provider value={value}>
            {children}
        </CarouselContext.Provider>
    );
};
