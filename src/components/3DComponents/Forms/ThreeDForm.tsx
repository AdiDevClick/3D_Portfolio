import {
    checkThisFormValidity,
    handleChange,
    handleKeyDown,
    handleSubmit,
} from '@/components/3DComponents/Forms/formsFunctions';
import { ContactFormData } from '@/components/3DComponents/Forms/formsTypes';
import { Button3D } from '@/components/3DComponents/Forms/ThreeDButton';
import { ThreeDInput } from '@/components/3DComponents/Forms/ThreeDInput';
import { Text } from '@react-three/drei';
import { useState } from 'react';
import formInputs from '@data/form-inputs.json';
import { emailInputRegex, phoneRegex } from '@/configs/formHandler.config';
import { ThreeDFormMessage } from '@/components/3DComponents/Forms/ThreeDFormMessage';

/**
 * Inputs configuration for the form
 * This is imported from the form-inputs.json file
 * and contains the inputs to be displayed in the form.
 */

const inputs = formInputs;

/**
 * Event properties to be passed to the form events
 * This will be used in the formEvents object below
 * and filled inside the ThreeDForm component
 */
let eventProps = {};

/**
 * ThreeDInput events for the form
 */
const formEvents = {
    onChange: (e) => handleChange({ e, ...eventProps }),
    onKeyDown: (e) => handleKeyDown({ e }),
    // onClick is overridden by the ThreeDInput component
    // It will only be called in the Button3D component
    onClick: (e) => handleSubmit({ e, ...eventProps }),
};

/**
 * Regex patterns for input validation
 * This regroup all regex patterns from the formHandler.config file
 */
const regexArray = {
    email: emailInputRegex,
    number: phoneRegex,
};

/**
 * 3D Form Component
 *
 * @Description Important events are created in the formEvents object just above.
 * Some events for the ThreeDInput (onClick, onPointerOver,onPointerOut) are hard coded in the ThreeDInput component.
 */
export function ThreeDForm({
    setIsFormActive,
    navigate,
}: {
    setIsFormActive?: (active: boolean) => void;
}) {
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
            {/* <Html>
                <form className="hidden-form" ref={formRef}></form>
            </Html> */}
            <mesh
                position={[2.1, 1.3, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFormActive(false);
                    navigate('/contact');
                }}
            >
                <boxGeometry args={[0.2, 0.2, 0.08]} />
                <meshBasicMaterial />
            </mesh>

            <Text
                position={[0, 1.2, 0]}
                fontSize={0.12}
                color="#333"
                fontWeight="bold"
            >
                Formulaire de Contact 3D
            </Text>

            <Text
                position={[0, 1, 0]}
                fontSize={0.06}
                color="#666"
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
                    setFormData={setFormData}
                    isValid={
                        regexArray[input.name]
                            ? regexArray[input.name].test(formData[input.name])
                            : null
                    }
                    {...formEvents}
                />
            ))}
            <Button3D
                position={[0, -1.5, 0]}
                disabled={!isFormValid.isValid}
                {...formEvents}
            />
            <ThreeDFormMessage
                formData={formData}
                isSubmitting={isSubmitting}
            />
        </group>
    );
}
