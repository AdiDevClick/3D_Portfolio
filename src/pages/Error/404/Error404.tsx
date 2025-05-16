import { FallbackText } from '@/components/3DComponents/Title/FallbackText';
import '@css/404.css';
import {
    Billboard,
    Float,
    MeshTransmissionMaterial,
    MeshTransmissionMaterialProps,
} from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useOutletContext } from 'react-router';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';
import { Object3D } from 'three';

type ContextType = {
    isMobile: boolean;
    scaleX: number;
};

const floatOptions = {
    // speed: 0.1 + Math.random() * 2,
    // speed: 1.2,
    rotationIntensity: 0.3,
    floatIntensity: 0.5,
};
const modelPath = `${
    import.meta.env.BASE_URL
}assets/models/original/Brokenglass_model.glb`;

/**
 * Affiche la page 404
 */
export function Error404() {
    const { isMobile, scaleX } = useOutletContext<ContextType>();
    const { nodes } = useLoader(GLTFLoader, modelPath, (loader) => {
        const gltfLoader = loader as GLTFLoader;
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        gltfLoader.setDRACOLoader(dracoLoader);
    });
    // const { nodes } = useLoader(
    //     GLTFLoader,
    //     modelPath,
    //     (loader) => {
    //         try {
    //             const dracoLoader = new DRACOLoader();
    //             dracoLoader.setDecoderPath(
    //                 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //             );

    //             const gltfLoader = loader as GLTFLoader;
    //             gltfLoader.setDRACOLoader(dracoLoader);
    //         } catch (e) {
    //             console.error('Erreur lors de la configuration du loader:', e);
    //             setError(true);
    //         }
    //     },
    //     (e) => {
    //         console.error('Erreur lors du chargement du modèle:', e);
    //         setError(true);
    //     }
    // );

    return (
        <Billboard position={[0, 1, 0]}>
            <FallbackText fontSize={3 * scaleX} position={[0, 0, -10]}>
                404
            </FallbackText>
            <FallbackText fontSize={0.5 * scaleX} position={[0, -1.5, -10]}>
                Cette page est introuvable
            </FallbackText>
            <FallbackText fontSize={0.15 * scaleX} position={[0, -2, -10]}>
                Cette page était là auparavant, peut-être pas d'ailleurs... Mais
                il semble que tu sois parti à sa recherches !
            </FallbackText>
            <FallbackText fontSize={0.15 * scaleX} position={[0, -3, -10]}>
                Le bouton ci-dessous te ramènera en lieux sûrs
            </FallbackText>
            <group position={[-8 * scaleX, -9 * scaleX, 0]} scale={5 * scaleX}>
                {nodes.Scene?.children.map((node: Object3D) => {
                    return (
                        <Float
                            {...floatOptions}
                            speed={0.1 + Math.random() * 2}
                            key={node.uuid}
                        >
                            <GlassMesh
                                name="glass-mesh"
                                data={node}
                                isMobile={isMobile}
                            />
                        </Float>
                    );
                })}
            </group>
            {/* <div className="info">
                <h2 className="fourofour">Cette page est introuvable</h2>
                <p className="fourofour">
                    Cette page était là auparavant, peut-être pas d'ailleurs...
                    Mais il semble que tu sois parti à sa recherches !
                </p>
                <p>Le bouton ci-dessous te ramènera en lieux sûrs</p>
                <NavLink
                    to={'/'}
                    className="btn fourofour"
                    rel="noreferrer noopener"
                >
                    Accueil
                </NavLink>
            </div> */}
            {/* <NavLink className="error__link" to={'/test'}>
                Retourner sur la page d’accueil
            </NavLink> */}
        </Billboard>
    );
}

function GlassMesh({
    data,
    isMobile,
    ...props
}: {
    data: Object3D;
    isMobile: boolean;
} & MeshTransmissionMaterialProps) {
    return (
        <mesh {...data} {...props}>
            <MeshTransmissionMaterial
                roughness={0.01}
                metalness={isMobile ? 0.1 : 0.15}
                clearcoat={0.2}
                samples={isMobile ? 2 : 18}
                thickness={1}
                chromaticAberration={0.15}
                anisotropy={isMobile ? 0 : 0.6}
                resolution={isMobile ? 128 : 512}
                distortion={isMobile ? 0 : 0.01}
                ior={isMobile ? 1.5 : 1.3}
            />
        </mesh>
    );
}
