import { formActionHandler } from '@/api/submit/action';
import { Button } from '@/components/HTML/button/Button';
import { useActionState } from 'react';

/**
 * Contenu HTML de la page contact
 */
export function ContactContent({ ...props }) {
    const [state, formAction, isPending] = useActionState(
        formActionHandler,
        undefined
    );

    return (
        <form action={formAction} {...props}>
            <h1 style={{ color: 'black' }}>Me Contacter</h1>
            <p className="contact-form__body" style={{ color: 'black' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, voluptatibus. Lorem ipsum dolor sit amet{' '}
            </p>
            <input
                className="input"
                type="email"
                name="email"
                placeholder="Votre adresse mail"
            />
            <textarea
                className="textarea"
                name="message"
                placeholder="Votre message"
                rows={5}
            />
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
