import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export function SwitchPagesOnScroll({ visible }: ScrollResetProps) {
    const [isScrollCompleted, setIsScrollCompleted] = useState(false);
    const [isWheeling, setIsWheeling] = useState(false);
    const scroll = useScroll();
    const navigate = useNavigate();

    const wheelTimeoutRef = useRef(0);
    const frameCountRef = useRef(0);

    useEffect(() => {
        if (isScrollCompleted) {
            switch (visible) {
                case 'home':
                    navigate('/a-propos');
                    setIsScrollCompleted(false);
                    break;
                case 'about':
                    navigate('/projets');
                    setIsScrollCompleted(false);
                    break;
                case 'carousel':
                    navigate('/contact');
                    setIsScrollCompleted(false);
                    break;
                case 'contact':
                    navigate('/');
                    setIsScrollCompleted(false);
                    break;
                default:
                    break;
            }
        }
    }, [visible, isScrollCompleted]);

    useEffect(() => {
        const handleWheel = () => {
            setIsWheeling(true);
            console.log('wheel event detected');
            clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = setTimeout(() => {
                console.log('wheel timeout off');
                setIsWheeling(false);
                setIsScrollCompleted(false);
            }, 100);
        };

        const scrollElement = scroll.el;
        if (scrollElement) {
            scrollElement.addEventListener('wheel', handleWheel, {
                passive: true,
            });
            console.log('wheel event listener added');
            return () => {
                console.log('wheel event listener deleted');
                scrollElement.removeEventListener('wheel', handleWheel);
                clearTimeout(wheelTimeoutRef.current);
            };
        }
    }, [scroll.el]);

    /**
     * Scroll type error is inevitable
     * @description : This is a workaround to reset the scroll position
     */
    useFrame(() => {
        frameCountRef.current += 1;
        if (frameCountRef.current % 30 === 0) {
            if (scroll.offset >= 1 && !isScrollCompleted) {
                setIsScrollCompleted(true);
                console.log(scroll);
            }

            if (
                (visible === 'carousel' || visible === 'contact') &&
                isWheeling &&
                !isScrollCompleted
            ) {
                setIsScrollCompleted(true);
            }
        }
    });

    return null;
}
