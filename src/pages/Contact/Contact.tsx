import { onScrollHandler } from '@/components/3DComponents/Carousel/Functions.ts';
import { PageContainer } from '@/components/3DComponents/Html/PageContainer.tsx';
import { ContactContent } from '@/pages/Contact/ContactContent.tsx';

export function Contact() {
    return (
        <PageContainer pageName={'/contact'}>
            <ContactContent
                onWheel={onScrollHandler}
                className="contact"
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
