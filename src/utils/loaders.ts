import { DRACOLoader, GLTFLoader } from 'three-stdlib';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
);

export function createGLTFLoader() {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
}
