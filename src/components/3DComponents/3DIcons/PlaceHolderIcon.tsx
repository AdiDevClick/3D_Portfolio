import { HexCell } from '@/components/3DComponents/Shapes/HexCell.tsx';
import { Center } from '@react-three/drei';

/**
 * PlaceholderIcon component for loading state.
 *
 * @param props - Props for the PlaceholderIcon component
 * @returns A placeholder icon component that displays a hex cell in the center.
 */
export function PlaceholderIcon({ ...props }) {
    return (
        <group {...props}>
            <Center>
                <HexCell scalar={0.5} />
            </Center>
        </group>
    );
}
