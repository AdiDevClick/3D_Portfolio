import {
    DragEvent,
    MouseEventHandler,
    PropsWithChildren,
    TouchEventHandler,
} from 'react';
type ButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    onMouseEnter: MouseEventHandler<HTMLButtonElement>;
    onTouchStart: TouchEventHandler<HTMLButtonElement>;
    onTouchMove: TouchEventHandler<HTMLButtonElement>;
    onTouchEnd: TouchEventHandler<HTMLButtonElement>;
    onTouchCancel: TouchEventHandler<HTMLButtonElement>;
};

/**
 * Composant bouton réutilisable -
 * Il renvoie un callback au parent -
 */
export function Button({
    children,
    onClick,
    onMouseEnter,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    ...props
}: PropsWithChildren<ButtonProps>) {
    /**
     * Disable default drag behavior to
     * avoid conflicts -
     */
    const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <button
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onDragStart={handleDragStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            onMouseEnter={onClick}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
