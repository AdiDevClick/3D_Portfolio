import { useThrottle } from '@/hooks/useThrottle';
import { useState } from 'react';

// Pour tester votre hook
const TestComponent = () => {
    const [count, setCount] = useState(0);

    const throttledIncrement = useThrottle(() => {
        setCount((c) => c + 1);
        console.log('Throttled execution:', count);
    }, 1000);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={throttledIncrement}>
                Click rapidly (throttled)
            </button>
        </div>
    );
};
