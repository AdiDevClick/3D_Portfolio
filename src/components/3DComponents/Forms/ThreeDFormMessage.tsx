import { Text } from '@react-three/drei';

/**
 * ThreeDFormMessage component
 *
 * @description Displays a message based on the form submission status.
 *
 * @param formData - The form data state containing the message and status.
 * @param isSubmitting - Boolean indicating if the form is currently being submitted.
 */
export function ThreeDFormMessage({ formData, isSubmitting }) {
    const getMessage = () => {
        let message = '';
        let color = '#007bff';
        if (isSubmitting) {
            message = 'Envoi en cours...';
        }
        if (formData.success) {
            message = 'Merci pour votre message !';
            color = '#28a745';
        }
        if (formData.failed) {
            message = "Échec de l'envoi du message. Veuillez réessayer.";
            color = '#dc3545';
        }
        if (formData.retry > 0) {
            message = `Erreur... Nouvelle tentative en cours... (${formData.retry})`;
        }
        return { message, color: color };
    };
    const data = getMessage();
    return (
        <Text
            position={[0, -2, 0]}
            fontSize={0.06}
            color={data.color}
            maxWidth={2}
            textAlign="center"
        >
            {data.message}
        </Text>
    );
}
