import { IconsContainerContextTypes } from '@/components/3DComponents/3DIcons/IconsContainer';
import { createContext, ReactNode, Ref } from 'react';
import { Group } from 'three';

type IconsContainerProviderProps = {
    children: ReactNode;
    value: IconsContainerContextTypes;
    ref?: Ref<Group>;
};
export const IconsContainerContext =
    createContext<IconsContainerContextTypes | null>(null);
export function IconsContainerProvider({
    children,
    value,
    ref,
    ...props
}: IconsContainerProviderProps) {
    if (!value) {
        throw new Error('IconsContainerProvider requires a contextValue prop');
    }

    return (
        <IconsContainerContext.Provider value={value}>
            <group name="icon__center-container" ref={ref} {...props}>
                {children}
            </group>
        </IconsContainerContext.Provider>
    );
}
