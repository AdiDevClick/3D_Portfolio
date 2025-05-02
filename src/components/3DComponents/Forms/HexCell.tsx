/**
 * Creates a hexagonal cell component
 *
 * @description This component is used to create a hexagonal cell in a the Home Page.
 * - Scalar is used to scale the cell depending on the screen size.
 * @param  scalar - Scalar for the hex cell
 */
export function HexCell({ scalar }: { scalar: number }) {
    return (
        <mesh>
            <cylinderGeometry
                args={[scalar * 0.6, scalar * 0.6, 0.05 * scalar, 6]}
            />
            <meshStandardMaterial
                color="#2a2a2a"
                roughness={0.7}
                metalness={0.3}
            />
        </mesh>
    );
}
