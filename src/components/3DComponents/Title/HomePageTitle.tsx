import FloatingTitle from '@/components/3DComponents/Title/FloatingTitle';
import { HomePageTitleProps } from '@/components/3DComponents/Title/TitlesTypes';
import { Sparkles } from '@react-three/drei';

/**
 * Main title of the home page.
 *
 * @param ref - Ref of the group
 * @param scale - Scale of the title from the reducer generalScaleX
 */
export function HomePageTitle({ ref, scale }: HomePageTitleProps) {
    return (
        <group ref={ref} name="home-page-title-group">
            <FloatingTitle
                scale={scale}
                size={80}
                position-y={1}
                name="home-page-title"
                textProps={{
                    height: 40,
                }}
            >
                <Sparkles count={10} size={6} speed={0.4} color={'blue'} />
                Bienvenue
            </FloatingTitle>

            <FloatingTitle
                scale={scale}
                size={60}
                position-y={0}
                back
                name="home-page-title"
                textProps={{
                    height: 40,
                }}
            >
                sur mon
            </FloatingTitle>
            <FloatingTitle
                scale={scale}
                size={80}
                position-y={-1}
                back
                name="home-page-title"
                textProps={{
                    height: 40,
                }}
            >
                Portfolio !
            </FloatingTitle>
            {/* <Glow
                scale={size * 1.2}
                near={-25}
                color={glow || emissive || color}
            /> */}
        </group>
    );
}
// const Glow = ({ color, scale = 0.5, near = -2, far = 1.4 }) => (
//     <Billboard>
//         <mesh>
//             <circleGeometry args={[2 * scale, 16]} />
//             <LayerMaterial
//                 transparent
//                 depthWrite={false}
//                 blending={THREE.CustomBlending}
//                 blendEquation={THREE.AddEquation}
//                 blendSrc={THREE.SrcAlphaFactor}
//                 blendDst={THREE.DstAlphaFactor}
//             >
//                 <Depth
//                     colorA={color}
//                     colorB="black"
//                     alpha={1}
//                     mode="normal"
//                     near={near * scale}
//                     far={far * scale}
//                     origin={[0, 0, 0]}
//                 />
//                 <Depth
//                     colorA={color}
//                     colorB="black"
//                     alpha={0.5}
//                     mode="add"
//                     near={-40 * scale}
//                     far={far * 1.2 * scale}
//                     origin={[0, 0, 0]}
//                 />
//                 <Depth
//                     colorA={color}
//                     colorB="black"
//                     alpha={1}
//                     mode="add"
//                     near={-15 * scale}
//                     far={far * 0.7 * scale}
//                     origin={[0, 0, 0]}
//                 />
//                 <Depth
//                     colorA={color}
//                     colorB="black"
//                     alpha={1}
//                     mode="add"
//                     near={-10 * scale}
//                     far={far * 0.68 * scale}
//                     origin={[0, 0, 0]}
//                 />
//             </LayerMaterial>
//         </mesh>
//     </Billboard>
// );
