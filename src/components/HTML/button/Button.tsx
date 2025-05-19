import { ButtonProps } from '@/components/HTML/HTMLtypes';

/**
 * Composant bouton réutilisable -
 * Il renvoie un callback au parent -
 */
export function Button({ children, ref, ...props }: ButtonProps) {
    /**
     * Disable default drag behavior to
     * avoid conflicts -
     */
    // const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    //     e.preventDefault();
    // };

    return (
        <button ref={ref} {...props}>
            {children}
        </button>
    );
}
