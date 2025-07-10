import {
    checkThisFormValidity,
    handleChange,
    handleKeyDown,
    handleSubmit,
} from '@/components/3DComponents/Forms/formsFunctions';
import { ContactFormData } from '@/components/3DComponents/Forms/formsTypes';
import { Button3D } from '@/components/3DComponents/Forms/ThreeDButton';
import { ThreeDInput } from '@/components/3DComponents/Forms/ThreeDInput';
import { Html, Text } from '@react-three/drei';
import { useRef, useState } from 'react';
import formInputs from '@data/form-inputs.json';

const inputs = formInputs;
let eventProps = {};
const formEvents = {
    // ThreeDInput events
    onChange: (e) => handleChange({ e, ...eventProps }),
    onKeyDown: (e) => handleKeyDown({ e }),
    // onClick is overridden by the ThreeDInput component
    // It will only be called in the Button3D component
    onClick: (e) => handleSubmit({ e, ...eventProps }),
};

/**
 * 3D Form Component
 *
 * @Description Important events are created in the formEvents object just above.
 * Some events for the ThreeDInput (onClick, onPointerOver,onPointerOut) are hard coded in the ThreeDInput component.
 */
export function ThreeDForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
        number: '',
        retry: 0,
        success: false,
        failed: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Validation du formulaire
    // const isFormValid = formData.name && formData.email && formData.message;
    const isFormValid = checkThisFormValidity(formData);
    eventProps = {
        setFormData,
        formData,
        isSubmitting,
        setIsSubmitting,
        isFormValid,
    };

    return (
        <group rotation={[0, 3.15, 0]} position={[0, 0, -0.8]}>
            <Html>
                <form className="html-input-container" ref={formRef}></form>
            </Html>

            <Text
                position={[0, 1.2, 0]}
                fontSize={0.12}
                color="#333"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                Formulaire de Contact 3D
            </Text>

            <Text
                position={[0, 1, 0]}
                fontSize={0.06}
                color="#666"
                anchorX="center"
                anchorY="middle"
                maxWidth={2}
                textAlign="center"
            >
                Cliquez sur les boîtes pour saisir vos informations
            </Text>

            {inputs.map((input, index) => (
                <ThreeDInput
                    key={`input-${index}`}
                    {...input}
                    value={formData[input.name]}
                    formRef={formRef}
                    setFormData={setFormData}
                    {...formEvents}
                />
            ))}

            <Button3D
                position={[0, -1.5, 0]}
                disabled={!isFormValid.isValid}
                {...formEvents}
            />

            {isSubmitting && (
                <Text
                    position={[0, -2, 0]}
                    fontSize={0.06}
                    color="#007bff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {formData.retry > 0
                        ? `Erreur... Nouvelle tentative en cours... (${formData.retry})`
                        : 'Envoi en cours...'}
                </Text>
            )}
            {formData.success && (
                <Text
                    position={[0, -2, 0]}
                    fontSize={0.06}
                    color="#28a745"
                    anchorX="center"
                    anchorY="middle"
                >
                    Message envoyé avec succès !
                </Text>
            )}
            {formData.failed && (
                <Text
                    position={[0, -2, 0]}
                    fontSize={0.06}
                    color="#dc3545"
                    anchorX="center"
                    anchorY="middle"
                >
                    Échec de l'envoi du message. Veuillez réessayer.
                </Text>
            )}
        </group>
    );
}
