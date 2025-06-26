import { action } from '@/api/submit/action';
import { Button } from '@/components/HTML/button/Button';
import { useActionState, useRef } from 'react';

/**
 * Contenu HTML de la page contact
 */
export function ContactContent({ ...props }) {
    const [state, formAction, isPending] = useActionState(action, undefined);

    return (
        <form action={formAction} {...props}>
            <h1 style={{ color: 'black' }}>Me Contacter</h1>
            <p style={{ color: 'black' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
            </p>
            <input type="email" name="email" placeholder="Votre adresse mail" />
            <textarea name="message" placeholder="Votre message" rows={5} />
            <Button type="submit" className="button">
                {isPending ? "En cours d'envoi..." : 'Me Contacter'}
            </Button>

            {state?.message && (
                <p className={state.success ? 'success' : 'error'}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
