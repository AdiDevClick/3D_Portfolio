import { createForm } from '@/components/3DComponents/Forms/formsFunctions';
import {
    ANIM_POSITION_CONFIG_BASE,
    ANIM_ROTATION_CONFIG_BASE,
} from '@/configs/easingAnimation.confg';
import { animateItem } from '@/hooks/animation/useAnimateItems';
import { Text, useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { LoopOnce, Vector3 } from 'three';

export function Envelop({
    ref,
    navigate,
    setFormActive,
    isFormActive,
    isActive,
    groupRef,
    ...props
}) {
    const [animationEnd, setAnimationEnd] = useState(true);
    const { nodes, animations, materials } = useGLTF(
        `/assets/models/Envelop_model.glb`
    );

    const { actions } = useAnimations(animations, ref);
    const openEvenlop = actions.open;
    if (openEvenlop) {
        openEvenlop.clampWhenFinished = true;
        openEvenlop.setLoop(LoopOnce, 1);
        openEvenlop.timeScale = 2;
    }

    useFrame((_, delta) => {
        if (
            openEvenlop &&
            openEvenlop.time === openEvenlop.getClip().duration &&
            !animationEnd
        ) {
            !animationEnd && setAnimationEnd(true);
        }

        animateItem({
            item: {
                ...ANIM_POSITION_CONFIG_BASE,
                ref: ref,
                vectorTarget: isFormActive
                    ? new Vector3(2, 0, -0.8)
                    : new Vector3(0, 0, 0),
            },
            isActive,
            groupRef,
            delta,
        });

        animateItem({
            item: {
                ...ANIM_ROTATION_CONFIG_BASE,
                ref: ref,
                vectorTarget: isFormActive
                    ? new Vector3(0.3, 0, 0)
                    : new Vector3(0, 0, 0),
            },
            isActive,
            groupRef,
            delta,
        });
    });

    return (
        <group ref={ref} {...props} dispose={null}>
            <group
                name="Scene"
                position={[-1, 0, 0]}
                rotation={[0, Math.PI, 0]}
                onClick={(e) => {
                    if (openEvenlop) {
                        // openEvenlop.enabled = true;
                        setAnimationEnd(false);
                        openEvenlop.reset().play();
                        createForm({
                            e,
                            navigate,
                            setFormActive,
                            isFormActive,
                        });
                    }
                }}
            >
                <group
                    name="Armature"
                    scale={0.1}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 1, 0]}
                >
                    <skinnedMesh
                        name="path130001"
                        geometry={nodes.path130001.geometry}
                        material={materials['Material.001']}
                        skeleton={nodes.path130001.skeleton}
                    />
                    <primitive object={nodes.Bone} />
                    <primitive object={nodes.neutral_bone} />
                </group>
                <Text
                    position={[0.95, -0.3, 0.06]}
                    fontSize={0.2}
                    color={'#4a90e2'}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.5}
                    textAlign="center"
                >
                    Ecrire un message
                </Text>
            </group>
        </group>
    );
}
