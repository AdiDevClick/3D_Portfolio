import { useVirtualPageCount } from '@/hooks/pageScrolling/useVirtualPageCount';
import MemoizedAbout from '@/pages/About/About';
import { ScrollControls } from '@react-three/drei';
import ReactThreeTestRenderer from '@react-three/test-renderer';

const mockSceneParams = {
    contentWidth: 10,
    contentHeight: 7.05,
    generalScaleX: 1,
    visible: 'about',
    margin: 0.5,
    isMobile: false,
};

const mockGroupRef = {
    current: {
        userData: { contentSize: { y: 10 } },
        position: { x: 0, y: 0, z: 0 },
    },
};

describe('Testing hook : useVirtualPageCount', () => {
    it('should calculate correct page count for given content size', async () => {
        const renderer = await ReactThreeTestRenderer.create(
            <ScrollControls pages={3} damping={0.5}>
                <MemoizedAbout {...mockSceneParams} />
            </ScrollControls>
        );
        // const result = renderer(() => useVirtualPageCount(), {
        //     wrapper: TestWrapper,
        // });
        console.log(renderer);
        const mockGroupRef = {
            current: {
                userData: { contentSize: { y: 10 } },
                position: { x: 0, y: 0, z: 0 },
            },
        };

        // act(() => {
        //     result.current.calculateVirtualPageCount({
        //         groupRef: mockGroupRef,
        //         contentHeight: 7.05,
        //         isActive: true,
        //     });
        // });

        // // Vérifier que le calcul est correct
        // expect(result.current.pages).toBeCloseTo(2.1, 1);
    });

    // it('should handle low viewport factor correctly', () => {
    //     // Test pour le bug de factor faible
    //     const { result } = renderHook(() => useVirtualPageCount(), {
    //         wrapper: TestWrapper,
    //     });

    //     // Mock viewport avec factor faible
    //     const mockViewport = { height: 50, factor: 0.1 };

    //     // Test que le calcul utilise contentHeight au lieu de viewport
    //     expect(/* logique de test */).toBeTruthy();
    // });

    // it('should reset distance reference on page change', () => {
    //     // Test pour éviter les closures stales
    // });
});
