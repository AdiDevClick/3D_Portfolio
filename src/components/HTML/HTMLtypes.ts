import { ButtonHTMLAttributes, PropsWithChildren, ReactNode, Ref } from 'react';

export type ButtonProps = {
    ref: Ref<HTMLButtonElement>;
} & PropsWithChildren &
    ButtonHTMLAttributes<HTMLButtonElement>;

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
