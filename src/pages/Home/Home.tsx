import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { HomeContent } from '@/pages/Home/HomeContent.tsx';

const handleObserver = (mutationsList, observer) => {
    console.log('Mutation détectée:', mutationsList.length);
    mutationsList.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            console.log('Nœuds ajoutés:', mutation.addedNodes.length);
            const addedNodes = mutation.addedNodes[0].children;
            for (const node of addedNodes) {
                // if (this.#inputsToListen.includes(node.type)) {
                // Setting which input can be empty
                // setObjectPropertyTo(
                //     this.options.whichInputCanBeEmpty,
                //     node,
                //     node.name,
                //     'canBeEmpty',
                //     true
                // );
                // Setting which input can accept special char
                // setObjectPropertyTo(
                //     this.options.whichInputAllowSpecialCharacters,
                //     node,
                //     node.name,
                //     'allowSpecialCharacters',
                //     true
                // );
                // Creating valid / invalid icon for each inputs
                // this.#createIconContainer(node);
                // // Main dynamic checker
                // node.addEventListener(
                //     'input',
                //     debounce((e) => {
                //         this.#dynamicCheck(e.target);
                //     }, this.debounceDelay)
                // );
                // }
            }
        }
    });
};

export function Home() {
    return (
        <PageContainer pageName={'/'}>
            <HomeContent
                onWheel={onScrollHandler}
                className="home"
                style={{
                    // opacity: isLoaded ? 1 : 0,
                    transform: 'translate(-50%)',
                    transition:
                        'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    height: '500px',
                    width: 'clamp(min(52%, 100%), 100%, 52vw)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    zIndex: 0,
                }}
            />
        </PageContainer>
    );
}
