import { useEffect } from 'react';

export function usePerformanceChecker(
    lowQualityMode: boolean,
    setLowQualityMode: (value: boolean) => void
) {
    // Vérifie les performances de l'animation et active le mode basse qualité si nécessaire
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;

        const checkPerformance = () => {
            frameCount++;
            const now = performance.now();

            if (now - lastTime > 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = now;

                // Activer le mode basse qualité si les FPS sont trop bas
                if (fps < 30 && !lowQualityMode) {
                    console.log('low quality mode activated');
                    setLowQualityMode(true);
                } else if (fps > 45 && lowQualityMode) {
                    console.log('low quality mode disactivated');

                    setLowQualityMode(false);
                }
            }

            requestAnimationFrame(checkPerformance);
        };

        const id = requestAnimationFrame(checkPerformance);
        return () => cancelAnimationFrame(id);
    }, []);
}
