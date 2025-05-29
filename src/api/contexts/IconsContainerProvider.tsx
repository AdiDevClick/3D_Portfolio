import { IconsContainerContextTypes } from '@/components/3DComponents/3DIcons/IconsTypes';
import { ContactIconsContainerProviderTypes } from '@/components/3DComponents/Contact/ContactTypes';
import { createContext, ReactNode } from 'react';

type IconsContainerProviderProps = {
    children: ReactNode;
    value: ContactIconsContainerProviderTypes | IconsContainerContextTypes;
};
export const IconsContainerContext = createContext<
    IconsContainerProviderProps['value']
>(null!);
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
