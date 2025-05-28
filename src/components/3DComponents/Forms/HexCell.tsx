import {
    cylinderGeometry,
    hexBlackMetalMaterial,
} from '@/components/3DComponents/Forms/FormsMats';
import { HexCellProps } from '@/components/3DComponents/Forms/FormsTypes';

/**
 * Creates a hexagonal cell component
 *
 * @description This component is used to create a hexagonal cell in a the Home Page.
 * - Scalar is used to scale the cell depending on the screen size.
 * @param  scalar - Scalar for the hex cell
 */
export function HexCell({ scalar }: HexCellProps) {
    return (
        <mesh
            scale={scalar * 0.6}
            geometry={cylinderGeometry}
            material={hexBlackMetalMaterial}
        />
    );
}
