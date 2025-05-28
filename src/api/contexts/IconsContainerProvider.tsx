import { IconsContainerContextTypes } from '@/components/3DComponents/3DIcons/IconsContainer';
import { createContext, ReactNode } from 'react';

type IconsContainerProviderProps = {
    children: ReactNode;
    value: IconsContainerContextTypes;
};
export const IconsContainerContext =
    createContext<IconsContainerContextTypes | null>(null);
export function IconsContainerProvider({
    children,
    value,
}: IconsContainerProviderProps) {
    return (
        <IconsContainerContext.Provider value={value}>
            {children}
        </IconsContainerContext.Provider>
    );
}
