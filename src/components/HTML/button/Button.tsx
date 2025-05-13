import { ButtonHTMLAttributes, DragEvent, PropsWithChildren, Ref } from 'react';
type ButtonProps = {
    ref: Ref<HTMLButtonElement>;
};

/**
 * Composant bouton réutilisable -
 * Il renvoie un callback au parent -
 */
export function Button({
    children,
    ref,
    ...props
}: PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
    /**
     * Disable default drag behavior to
     * avoid conflicts -
     */
    const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <button
            ref={ref}
            // onClick={props.onClick}
            // onDrag={handleDragStart}
            {...props}
        >
            {children}
        </button>
    );
}
