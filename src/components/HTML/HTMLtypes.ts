import { ButtonHTMLAttributes, PropsWithChildren, ReactNode, Ref } from 'react';

/**
 * Generic Button Props
 *
 * @template T - Generic type for custom properties
 */
export interface ButtonProps<T>
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        PropsWithChildren {
    ref?: Ref<HTMLButtonElement>;
    className?: string;
    customProps?: T;
}

export type HeadersProps = {
    isMobile: boolean;
};

export type TagsTypes = {
    children: ReactNode;
    /** url du logo */
    logo: string;
};

export type TagsContainerProps = {
    children: ReactNode;
};
