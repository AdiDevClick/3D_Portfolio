import { ContactIconsContainer } from '@/components/3DComponents/Contact/ContactIconsContainer';
import { BillboardPageContainer } from '@/components/3DComponents/Html/BillboardPageContainer';
import { PagesTypes } from '@/components/3DComponents/Scene/SceneTypes';
import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import {
    ACTIVE_PROJECTS_POSITION_SETTINGS,
    DEFAULT_PROJECTS_POSITION_SETTINGS,
    DESKTOP_TITLE_POSITION,
} from '@/configs/3DCarousel.config';
import {
    CONTACT_ICONS_POSITION_SETTINGS,
    DESKTOP_ICONS_MARGINS_POSITION_SETTINGS,
    MOBILE_ICONS_MARGINS_POSITION_SETTINGS,
} from '@/configs/ContactIcons.config';
import { animateItem } from '@/hooks/animation/useAnimateItems';
import { ContactContent } from '@/pages/Contact/ContactContent';
import { frustumChecker } from '@/utils/frustrumChecker';
import {
    Billboard,
    Center,
    Edges,
    Environment,
    Html,
    Image,
    MeshPortalMaterial,
    PivotControls,
    RenderCubeTexture,
    RenderTexture,
    RoundedBox,
    Sparkles,
    Stars,
    Text,
    useCursor,
    useGLTF,
} from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import {
    act,
    Component,
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    DoubleSide,
    Group,
    Mesh,
    PlaneGeometry,
    Vector3,
    Euler,
    Material,
} from 'three';
import '@css/Contact.scss';
import { useControls } from 'leva';
import { HtmlContainer } from '@/components/3DComponents/Html/HtmlContainer';
import {
    NavigateFunction,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router';
import { Title } from '@/components/3DComponents/Title/Title';
import { ThreeDForm } from '@/components/3DComponents/Forms/ThreeDForm';
import { ThreeDFormV2 } from '@/components/3DComponents/Forms/ThreeDFormV2';
import { ThreeDInput } from '@/components/3DComponents/Forms/ThreeDInput';
import { ContactFormWithNativeForm } from '@/components/3DComponents/Forms/ContactFormExamples';
import { ContactFormThreeD } from '@/components/3DComponents/Forms/ContactFormThreeD';
import {
    checkThisFormValidity,
    handleChange,
    handleKeyDown,
    handleSubmit,
} from '@/components/3DComponents/Forms/formsFunctions';
import { mul } from 'three/src/nodes/TSL.js';

let currentGroupPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();
let currentIconsPos = DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

const ANIM_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.3,
    type: 'position' as const,
};
const ANIM_SCALE_CONFIG_BASE = {
    animationType: easing.damp3,
    time: 0.2,
    type: 'scale' as const,
};

export const portalContext = createContext<{
    contentHeight: number;
    contentWidth: number;
    generalScaleX: number;
    isMobile: boolean;
    boxSize: { x: number; y: number; z: number };
    activeTopSide: number;
    nodes: any;
    portalRefs: Map<string, React.RefObject<Mesh | null>>;
    navigate: any;
} | null>(null);

const MemoizedContact = memo(function Contact({
    isMobile,
    contentHeight,
    contentWidth,
    generalScaleX,
    visible,
}: PagesTypes) {
    const groupRef = useRef<Group>(null);
    const iconsRef = useRef<Group>(null);
    const contentRef = useRef<HTMLDivElement>(null!);
    const boxRef = useRef<Mesh>(null);
    const envelopeRef = useRef<Mesh>(null);
    const linkedInRef = useRef<Mesh>(null);
    const portalRefs = useRef<Map<string, React.RefObject<Mesh | null>>>(
        new Map()
    );

    const frameCountRef = useRef(0);

    // const { viewport } = useThree((state) => state);
    const [hovered, setHovered] = useState(false);
    const [isFormActive, setFormActive] = useState(false);
    const navigate = useNavigate();
    const { nodes } = useGLTF(
        '/assets/models/optimized/aobox-transformed-rect.glb'
    );
    const scale = hovered ? 1.2 : 1;

    const isActive = visible === 'contact';
    useCursor(hovered);

    currentGroupPos = isActive
        ? ACTIVE_PROJECTS_POSITION_SETTINGS.clone()
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    currentIconsPos = isActive
        ? CONTACT_ICONS_POSITION_SETTINGS(
              contentHeight,
              contentWidth,
              isMobile
                  ? MOBILE_ICONS_MARGINS_POSITION_SETTINGS
                  : DESKTOP_ICONS_MARGINS_POSITION_SETTINGS
          )
        : DEFAULT_PROJECTS_POSITION_SETTINGS.clone();

    useFrame((state, delta) => {
        if (!groupRef.current || !iconsRef.current) return;
        frameCountRef.current += 1;

        // Check if the objects are in the frustum
        frustumChecker(
            [groupRef.current, iconsRef.current],
            state,
            frameCountRef.current,
            isMobile
        );

        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: groupRef,
                effectOn: currentGroupPos,
                time: 0.2,
            },
            isActive,
            groupRef,
            delta,
        });
        animateItem({
            item: {
                ...ANIM_CONFIG_BASE,
                ref: iconsRef,
                effectOn: currentIconsPos,
            },
            isActive,
            groupRef,
            delta,
        });
        animateItem({
            item: {
                ...ANIM_SCALE_CONFIG_BASE,
                ref: groupRef,
                effectOn: [scale, scale, scale],
            },
            isActive,
            groupRef,
            delta,
        });
        // console.log(contentRef.current);
        // item.animationType(
        //     item.ref.current[item.type] as any,
        //     item.effectOn as any,
        //     item.time,
        //     delta
        // );
    });
    const boxSize = {
        x:
            4 *
            (generalScaleX * (isMobile ? 0.8 : 1)) *
            (nodes.Cube?.scale.x || 1),
        y: 4 * generalScaleX * (nodes.Cube?.scale.y || 1),
        z:
            4 *
            (generalScaleX * (isMobile ? 0.8 : 1)) *
            (nodes.Cube?.scale.z || 1),
    };

    // Calcul de la dimension active pour la synchronisation des faces
    const activeTopSide = boxSize.z / (nodes.Cube?.scale.z || 1);

    const context = {
        contentHeight: contentHeight,
        contentWidth: contentWidth,
        generalScaleX: generalScaleX,
        isMobile: isMobile,
        boxSize: boxSize,
        activeTopSide: activeTopSide,
        nodes: nodes,
        navigate,
        portalRefs: portalRefs.current,
    };
    // Create a context for the portal

    return (
        <group ref={groupRef} visible={isActive}>
            <FloatingTitle
                position={[-2.2, 0, 0]}
                text="Me contacter sur LinkedIn"
                isClickable={true}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
                onClick={onClickHandler}
                scalar={generalScaleX}
                size={30}
                name="contact-title"
                textProps={{
                    height: 20,
                    color: hovered ? '#fffff' : '#000000',
                }}
            >
                {hovered && (
                    <Html position={[0, 2, 0]}>
                        <div className="about__tooltip">
                            Visitez mon LinkedIn
                        </div>
                    </Html>
                )}
            </FloatingTitle>
            {/* <Sparkles
                // position={[2.2, 0, 0]}
                count={30}
                size={6}
                speed={0.4}
                color={'blue'}
            /> */}
            <ContactIconsContainer
                key={`contact-icons`}
                ref={iconsRef}
                scalar={generalScaleX}
                isMobile={isMobile}
            />

            {isActive && (
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
            )}
            {/* <group ref={contentRef}>
                <BillboardPageContainer pageName="/contact">
                    <ContactContent className={'contact-form'} />
                </BillboardPageContainer>
            </group> */}
            {/* <PivotControls
                anchor={[-1.1, -1.1, -1.1]}
                autoTransform
                scale={0.75}
                lineWidth={3.5}
            >
                <mesh castShadow receiveShadow ref={boxRef}>
                    <boxGeometry
                        args={[boxSize.x, boxSize.y, boxSize.z]}
                        scale={[1, 1, 1]}
                    />
                    <Edges />
                    <portalContext.Provider value={context}>
                        <Side rotation={[0, 0, 0]} bg="orange" index={0}>
                            <group rotation={[0, 1.5, 0]}>
                                <Billboard
                                    position={[
                                        DESKTOP_TITLE_POSITION[0],
                                        DESKTOP_TITLE_POSITION[1] + 1,
                                        DESKTOP_TITLE_POSITION[2],
                                    ]}
                                >
                                    <FloatingTitle
                                        rotation={[0, 3.164, 0]}
                                        scalar={generalScaleX}
                                        text={'Formulaire de contact'}
                                    />
                                </Billboard>
                                <ContactFormThreeD />
                            </group>
                        </Side>
                        <Side
                            rotation={[0, Math.PI, 0]}
                            bg="lightblue"
                            index={1}
                        >
                            <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
                        </Side>
                        <Side
                            rotation={[0, Math.PI / 2, Math.PI / 2]}
                            bg="lightgreen"
                            index={2}
                        >
                            <boxGeometry args={[1.15, 1.15, 1.15]} />
                        </Side>
                        <Side
                            rotation={[0, Math.PI / 2, -Math.PI / 2]}
                            bg="aquamarine"
                            index={3}
                        >
                            <octahedronGeometry />
                        </Side>
                        <Side
                            rotation={[0, -Math.PI / 2, 0]}
                            bg="indianred"
                            index={4}
                        >
                            <icosahedronGeometry />
                        </Side>
                        <Side
                            rotation={[0, Math.PI / 2, 0]}
                            bg="hotpink"
                            index={5}
                        >
                            <dodecahedronGeometry />
                        </Side>
                        <Rig parentElement={boxRef} />
                    </portalContext.Provider>
                </mesh>
            </PivotControls> */}
            {/* <mesh ref={linkedInRef} position={[2.2, 0, 0]}>
                <RoundedBox args={[3, 0.5, 0.5]}>
                    <meshStandardMaterial color="#f3f3f3" />
                </RoundedBox>
                <Text
                    position={[0, 0, -0.26]}
                    fontSize={0.2}
                    rotation={[0, 3.14, 0]}
                    color={'#4a90e2'}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.5}
                    textAlign="center"
                >
                    Me contacter sur LinkedIn
                </Text>
            </mesh> */}

            <mesh
                ref={envelopeRef}
                position={[-2.2, 0, 0]}
                onClick={(e) =>
                    createForm({ e, navigate, setFormActive, isFormActive })
                }
            >
                <RoundedBox args={[3, 0.5, 0.5]}>
                    <meshStandardMaterial color="#f3f3f3" />
                </RoundedBox>
                <Text
                    position={[0, 0, -0.265]}
                    fontSize={0.2}
                    rotation={[0, 3.14, 0]}
                    color={'#4a90e2'}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.5}
                    textAlign="center"
                >
                    Ecrire un message
                </Text>
            </mesh>
            {isFormActive && <ContactForm3D />}
        </group>
    );
});

function onClickHandler(e: ThreeEvent<globalThis.MouseEvent>) {
    e.stopPropagation();
    window.open('https://www.linkedin.com/in/adrien-quijo');
}

function Side({ rotation = [0, 0, 0], bg = '#f0f0f0', children, index }: any) {
    const context = useContext(portalContext);
    const params = useParams();
    const frameCountRef = useRef(0);
    if (!context) return null;

    const {
        boxSize,
        activeTopSide,
        nodes,
        generalScaleX,
        contentHeight,
        contentWidth,
        isMobile,
        navigate,
        portalRefs,
    } = context;
    const mesh = useRef<Mesh>(null);
    const groupRef = useRef<Group>(null);
    const portal = useRef<Mesh>(null);
    const portalWorld = useRef<Mesh>(null);
    const portalName = `contact-portal-${index}`;
    /**
     * Saving the portal reference in the context
     * This will allow us to access the portal from the Rig component
     */
    useEffect(() => {
        if (!portalWorld.current) return;

        if (!portalRefs.has(portalName)) {
            portalRefs.set(portalName, portalWorld.current);
        }
    }, []);

    useFrame((state, delta) => {
        if (!portal.current || !mesh.current) return;
        easing.damp(
            portal.current,
            'blend',
            params.id === portalName ? 1 : 0,
            0.2,
            delta
        );
        // if (!portal.current) return;
        // frameCountRef.current += 1;
        // if (frameCountRef.current % 1000 === 0) {
        //     console.log(
        //         'visible ?:',
        //         portal.current.visible,
        //         ' portal => :',
        //         portal.current
        //     );
        // }
        // Pas de frustumChecker pour les portails
        // Les portails gèrent leur propre visibilité via MeshPortalMaterial
        // mesh.current.rotation.x = mesh.current.rotation.y += delta;
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!e.object.name || params.id === e.object.name) return;
        e.stopPropagation();
        navigate(`/contact/${e.object.name}`);
        console.log('je clic : ', e.object.name, bg, ' color');
    };
    return (
        <MeshPortalMaterial
            worldUnits={false}
            attach={`material-${index}`}
            ref={portal}
            side={DoubleSide}
            // events={params.id === portalName}
        >
            {/** Everything in here is inside the portal and isolated from the canvas */}
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            {/** A box with baked AO */}
            {/* <group
                ref={portal}
                name={`contact-portal-${index}`}
                onClick={handleClick}
            > */}
            <mesh
                ref={portalWorld}
                name={`contact-portal-${index}`}
                onClick={handleClick}
                castShadow
                receiveShadow
                rotation={rotation}
                geometry={nodes.Cube.geometry}
                scale={[boxSize.x / 2, boxSize.y / 2, boxSize.z / 2]}
            >
                <meshStandardMaterial
                    aoMapIntensity={1}
                    aoMap={nodes.Cube.material.aoMap}
                    color={bg}
                />
                <spotLight
                    castShadow
                    color={bg}
                    intensity={2}
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    shadow-normalBias={0.05}
                    shadow-bias={0.0001}
                />
            </mesh>
            {/** The shape inside portal scene */}
            <mesh castShadow receiveShadow ref={mesh}>
                {children}
                <meshLambertMaterial color={bg} />
            </mesh>
            {/* </group> */}
        </MeshPortalMaterial>
    );
}

// Composant Button3D - Bouton d'envoi 3D

function Button3D({ position, disabled = false, ...props }: Button3DProps) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<Mesh>(null);

    // const handleClick = useCallback(
    //     (e: any) => {
    //         e.stopPropagation();
    //         if (!disabled) {
    //             onClick();
    //         }
    //     },
    //     [onClick, disabled]
    // );

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                {...props}
            >
                <boxGeometry args={[1.2, 0.3, 0.08]} />
                <meshStandardMaterial
                    color={
                        disabled ? '#6c757d' : hovered ? '#28a745' : '#5cb85c'
                    }
                    transparent
                    opacity={disabled ? 0.5 : 0.9}
                    emissive={hovered && !disabled ? '#0a4015' : '#000'}
                />
            </mesh>
            <Text
                fontSize={0.08}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                position={[0, 0, 0.041]}
            >
                Envoyer
            </Text>
        </group>
    );
}
const inputs = [
    {
        position: [-1, 0.4, 0],
        name: 'number',
        type: 'text',
        placeholder: 'Saisissez votre numéro de téléphone (optionnel)',
    },
    {
        position: [-1, -0.1, 0],
        name: 'name',
        type: 'text',
        placeholder: 'Saisissez votre nom',
    },
    {
        position: [1, -0.1, 0],
        name: 'email',
        type: 'email',
        placeholder: 'Saisissez votre email',
    },
    {
        position: [0, -0.8, 0],
        name: 'message',
        type: 'textarea',
        isMultiline: true,
        placeholder: 'Votre message',
    },
];

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
function ContactForm3D() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
        number: '',
        retry: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Soumission du formulaire
    // const handleSubmit = useCallback(async () => {
    //     if (!formData.name || !formData.email || !formData.message) {
    //         alert('Veuillez remplir tous les champs');
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         // Simuler l'envoi (remplacer par votre API)
    //         await new Promise((resolve) => setTimeout(resolve, 2000));

    //         alert('Message envoyé avec succès !');
    //         setFormData({ name: '', email: '', message: '' });
    //     } catch (error) {
    //         alert("Erreur lors de l'envoi du message");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // }, [formData]);

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
    console.log(isSubmitting, 'isSubmitting');
    return (
        <group rotation={[0, 3.15, 0]} position={[0, 0, -0.8]}>
            <Html>
                <form ref={formRef}></form>
            </Html>

            <Text
                position={[0, 1.2, 0]}
                fontSize={0.12}
                color="#333"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                🎯 Formulaire de Contact 3D
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

            {/* Bouton d'envoi */}
            <Button3D
                position={[0, -1.5, 0]}
                disabled={!isFormValid.isValid}
                {...formEvents}
                // disabled={!isFormValid || isSubmitting}
            />

            {/* Indicateur de chargement */}
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
        </group>
    );
}

function Rig({
    position = new Vector3(0, 0, 20),
    focus = new Vector3(0, 0, 0),
    parentElement,
}: any) {
    const { camera, controls } = useThree();
    const context = useContext(portalContext);
    const params = useParams();
    const location = useLocation();

    // Mapping des portails vers leurs rotations
    const portalRotations = {
        'contact-portal-0': [0, 0, 0],
        'contact-portal-1': [0, Math.PI, 0],
        'contact-portal-2': [0, Math.PI / 2, Math.PI / 2],
        'contact-portal-3': [0, Math.PI / 2, -Math.PI / 2],
        'contact-portal-4': [0, -Math.PI / 2, 0],
        'contact-portal-5': [0, Math.PI / 2, 0],
    };

    useEffect(() => {
        if (!location.pathname.includes('/contact')) return;

        // console.log('Looking for portal:', params.id);
        // console.log('active ref ', Array.from(context.portalRefs.values()));
        // const boxMesh = parentElement.current;
        // if (!boxMesh) {
        //     console.log('No box mesh found');
        //     return;
        // }

        // // Utiliser la rotation du portail pour calculer la position de caméra
        // const rotation =
        //     portalRotations[params.id as keyof typeof portalRotations];
        // if (!rotation) {
        //     console.log('No rotation found for portal:', params.id);
        //     return;
        // }

        // console.log('Portal rotation:', rotation);

        // // Obtenir la position du box dans le monde
        // const boxWorldPosition = new Vector3();
        // boxMesh.getWorldPosition(boxWorldPosition);

        // // Calculer la normale de la face basée sur la rotation
        // const faceNormal = new Vector3(0, 0, 1); // Face normale (vers l'extérieur)
        // const euler = new Euler(rotation[0], rotation[1], rotation[2]);
        // faceNormal.applyEuler(euler);

        // // Positionner la caméra en face de cette face
        // const cameraDistance = 3;
        // const cameraPosition = boxWorldPosition
        //     .clone()
        //     .add(faceNormal.clone().multiplyScalar(cameraDistance));

        // // Appliquer directement à la caméra
        // camera.position.copy(cameraPosition);
        // camera.lookAt(boxWorldPosition);

        // console.log('Box position:', boxWorldPosition);
        // console.log('Face normal:', faceNormal);
        // console.log('Camera position:', camera.position);
        // console.log('Camera target:', boxWorldPosition);.
        const active = context.portalRefs.get(params.id);
        // console.log(active, 'active ref');
        // const active = parentElement.current?.getObjectByName(params.id);
        if (active) {
            active.localToWorld(position.set(4, 1, -4));
            active.localToWorld(focus.set(0, 0, 0));
            // active.parent.localToWorld(position.set(0, 0.5, 0.25));
            // active.parent.localToWorld(focus.set(0, 0, -2));
            // console.log('monde activé : ', active.localToWorld);
        }
        // console.log('je bouge la camera', position, focus);
        controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
    });

    return null;
}

/**
 * Creates a form when the envelope icon is clicked.
 *
 * @description This function navigates to the contact form page and sets the form as active.
 * - If already active or the current path is '/contact/form', it does nothing.
 *
 * @param e - Mouse click Event
 * @param navigate - Function to navigate to a different route
 * @param setFormActive - Function to set the form active state
 * @param isFormActive - Boolean indicating if the form is currently active
 */
export function createForm({
    e,
    navigate,
    setFormActive,
    isFormActive,
}: {
    e: ThreeEvent<MouseEvent>;
    navigate: NavigateFunction;
    setFormActive: (active: boolean) => void;
    isFormActive: boolean;
}) {
    e.stopPropagation();
    if (window.location.pathname !== '/contact/form') navigate('/contact/form');
    if (!isFormActive) setFormActive(true);
}

interface Button3DProps {
    position: [number, number, number];
    onClick: () => void;
    disabled?: boolean;
}

// Interface pour les données du formulaire
interface ContactFormData {
    name: string;
    email: string;
    message: string;
    number?: string;
}

// Composant Input3D - Une boîte 3D interactive qui devient un input de texte
interface Input3DProps {
    position: [number, number, number];
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    fieldName: keyof ContactFormData;
    isMultiline?: boolean;
}
export default MemoizedContact;
