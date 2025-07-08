import { Html, Text } from '@react-three/drei';
import { useRef, useState, useCallback } from 'react';
import { ThreeDInput } from './ThreeDInput';

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface ThreeDFormProps {
    onSubmit?: (data: FormData) => void;
    position?: [number, number, number];
}

export function ThreeDForm({
    onSubmit,
    position = [0, 0, 0],
}: ThreeDFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const formRef = useRef<HTMLFormElement>(null);

    // Mettre à jour un champ spécifique
    const updateField = useCallback(
        (field: keyof FormData, value: string) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Nettoyer l'erreur pour ce champ
            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: undefined,
                }));
            }
        },
        [errors]
    );

    // Validation du formulaire
    const validateForm = useCallback((): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Soumission du formulaire
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            setIsSubmitting(true);

            try {
                // Utiliser l'API FormData native si besoin
                const nativeFormData = new FormData(formRef.current!);

                // Ou utiliser directement notre état
                await onSubmit?.(formData);

                // Reset du formulaire après soumission réussie
                setFormData({ name: '', email: '', message: '' });

                console.log('Formulaire soumis avec succès !');
            } catch (error) {
                console.error('Erreur lors de la soumission:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, onSubmit, validateForm]
    );

    // Reset du formulaire
    const handleReset = useCallback(() => {
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
    }, []);

    return (
        <group position={position}>
            {/* Titre du formulaire */}
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.15}
                color="#333"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                📝 Formulaire de Contact 3D
            </Text>

            {/* Instructions */}
            <Text
                position={[0, 1.2, 0]}
                fontSize={0.07}
                color="#666"
                anchorX="center"
                anchorY="middle"
                maxWidth={3}
                textAlign="center"
            >
                Cliquez sur les boîtes pour saisir vos informations
            </Text>

            {/* Form HTML invisible pour la validation native */}
            <Html
                position={[0, 0, 0]}
                style={{ opacity: 0, pointerEvents: 'none' }}
            >
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    className="hidden-form"
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={() => {}}
                        required
                        aria-label="Nom"
                        title="Nom complet"
                    />
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={() => {}}
                        required
                        aria-label="Email"
                        title="Adresse email"
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={() => {}}
                        required
                        aria-label="Message"
                        title="Votre message"
                    />
                    <button type="submit" hidden>
                        Submit
                    </button>
                    <button type="reset" hidden>
                        Reset
                    </button>
                </form>
            </Html>

            {/* Champ Nom */}
            <ThreeDInput
                position={[0, 0.8, 0]}
                placeholder="Votre nom"
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                fieldName="name"
                error={errors.name}
                formRef={formRef}
            />

            {/* Champ Email */}
            <ThreeDInput
                position={[0, 0.3, 0]}
                placeholder="Votre email"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                fieldName="email"
                type="email"
                error={errors.email}
            />

            {/* Champ Message */}
            <ThreeDInput
                position={[0, -0.3, 0]}
                placeholder="Votre message"
                value={formData.message}
                onChange={(value) => updateField('message', value)}
                fieldName="message"
                isMultiline={true}
                error={errors.message}
            />

            {/* Boutons d'action */}
            <group position={[0, -1, 0]}>
                {/* Bouton Submit */}
                <mesh
                    position={[-0.8, 0, 0]}
                    onClick={() => {
                        if (formRef.current) {
                            formRef.current.requestSubmit();
                        }
                    }}
                >
                    <boxGeometry args={[1.2, 0.3, 0.08]} />
                    <meshStandardMaterial
                        color={isSubmitting ? '#6c757d' : '#28a745'}
                        transparent
                        opacity={isSubmitting ? 0.5 : 0.9}
                    />
                </mesh>
                <Text
                    position={[-0.8, 0, 0.041]}
                    fontSize={0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    {isSubmitting ? 'ENVOI...' : 'ENVOYER'}
                </Text>

                {/* Bouton Reset */}
                <mesh position={[0.8, 0, 0]} onClick={handleReset}>
                    <boxGeometry args={[1.2, 0.3, 0.08]} />
                    <meshStandardMaterial
                        color="#dc3545"
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                <Text
                    position={[0.8, 0, 0.041]}
                    fontSize={0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    RESET
                </Text>
            </group>

            {/* Indicateur de validation */}
            {Object.keys(errors).length > 0 && (
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.06}
                    color="#dc3545"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={3}
                    textAlign="center"
                >
                    ⚠️ Veuillez corriger les erreurs
                </Text>
            )}

            {/* Indicateur de soumission */}
            {isSubmitting && (
                <Text
                    position={[0, -1.8, 0]}
                    fontSize={0.06}
                    color="#007bff"
                    anchorX="center"
                    anchorY="middle"
                >
                    📤 Envoi en cours...
                </Text>
            )}
        </group>
    );
}
