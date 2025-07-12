import { ButtonProps } from '@/components/HTML/HTMLtypes';
import '@css/Button.scss';

/**
 * Composant bouton réutilisable -
 * Il renvoie un callback au parent -
 */
// export function Button({ children, ref, ...props }: ButtonProps) {
//     /**
//      * Disable default drag behavior to
//      * avoid conflicts -
//      */
//     // const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
//     //     e.preventDefault();
//     // };

//     return (
//         <button ref={ref} {...props}>
//             {children}
//         </button>
//     );
// }

/**
 * Button Component
 *
 * @description A simple button component that can be used to trigger actions.
 *
 * @params children - The content to be displayed inside the button.
 * @params className - Additional CSS classes to apply to the button.
 * @params type - The type of the button (default is 'button').
 * @params ref - A ref to the button element.
 */
export function Button<T>({
    children,
    ref,
    className = 'button',
    type = 'button',
    ...props
}: ButtonProps<T>) {
    return (
        <button ref={ref} type={type} className={className} {...props}>
            {children}
        </button>
    );
}
