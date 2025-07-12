import {
    handleBlur,
    handleClick,
} from '@/components/3DComponents/Forms/formsFunctions';
import { Html, Text } from '@react-three/drei';
import { useRef, useState } from 'react';

export function ThreeDInput({
    position,
    placeholder = 'Saisissez votre texte ici',
    value,
    type = 'text',
    isMultiline = false,
    formRef,
    isValid = true,
    ...props
}: {
    position: any;
    placeholder?: string;
    type?: string;
    isMultiline?: boolean;
    formRef?: React.RefObject<HTMLFormElement>;
}) {
    const [focused, setFocused] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // const meshRef = useRef<Mesh>(null!);
    const inputRef = useRef<HTMLInputElement>(null!);
    const textAreaRef = useRef<HTMLTextAreaElement>(null!);

    const functionProps = {
        setFormData: props.setFormData,
        setFocused,
        setIsEditing,
        isEditing,
        focused,
        inputRef: isMultiline ? textAreaRef : inputRef,
    };

    const getColor = () => {
        // if (error) return '#dc3545';
        if (value && !focused && !isValid && isValid !== null) return '#dc3545';
        if (focused) return '#4a90e2';
        if (value && (isValid || isValid === null)) return '#5cb85c';
        return '#6c757d';
    };

    return (
        <group position={position}>
            <mesh
                // ref={meshRef}
                onClick={(e) => handleClick({ e, ...functionProps })}
                onPointerOver={() => setFocused(true)}
                onPointerOut={() => !isEditing && setFocused(false)}
            >
                <boxGeometry
                    args={[
                        isMultiline ? 3.6 + 0.2 : 1.8,
                        isMultiline ? 0.8 : 0.3,
                        0.05,
                    ]}
                />
                <meshStandardMaterial
                    color={getColor()}
                    // transparent
                    // opacity={0.8}
                    emissive={focused ? '#111' : '#000'}
                />
            </mesh>

            <Text
                position={[0, 0, 0.026]}
                fontSize={0.08}
                color={value ? '#ffffff' : '#cccccc'}
                anchorX="center"
                anchorY="middle"
                maxWidth={1.6}
                textAlign="center"
            >
                {isEditing || value ? value : placeholder}
                {focused && isEditing ? '|' : ''}
            </Text>

            {/* {error && (
                <Text
                    position={[0, -0.25, 0]}
                    fontSize={0.05}
                    color="#dc3545"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.6}
                    textAlign="center"
                >
                    ⚠️ {error}
                </Text>
            )} */}

            {isEditing && (
                <Html
                    position={[0, 0, 0]}
                    className="html-input-container"
                    // portal={formRef}
                >
                    {!isMultiline ? (
                        <input
                            ref={inputRef}
                            value={value}
                            onBlur={(e) => handleBlur({ e, ...functionProps })}
                            placeholder={placeholder}
                            className="hidden-input"
                            autoFocus
                            {...props}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <textarea
                            ref={textAreaRef}
                            value={value}
                            onBlur={(e) => handleBlur({ e, ...functionProps })}
                            placeholder={placeholder}
                            className="hidden-input"
                            autoFocus
                            {...props}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </Html>
            )}
        </group>
    );
}
