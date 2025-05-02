import { Scroll } from '@react-three/drei';
import '@css/PageScroller.scss';

export function PageScoller() {
    return (
        <Scroll
            html
            // id="scroll-container"
            // style={{ width: '100vw', height: '100vh' }}
        >
            <div
                id="scroll-container"
                className="scroll-container"
                // style={{
                //     height: '1000vh',
                //     width: '100vw',
                //     overflow: 'auto',
                //     WebkitOverflowScrolling: 'touch', // Important pour iOS
                //     position: 'relative',
                //     // pointerEvents: reducer.activeContent?.isClicked
                //     //     ? 'none'
                //     //     : 'auto',
                //     backgroundColor: 'black',
                // }}
            ></div>
        </Scroll>
    );
}
