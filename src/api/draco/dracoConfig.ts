import { DRACOLoader } from 'three-stdlib';

const dracoLoader = new DRACOLoader();

export function dracoConfig() {
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    );
    return dracoLoader;
    // useEffect(() => {
    //     // ✅ Configuration une seule fois au démarrage
    //     // const gltf = new GLTFLoader();
    //     // const gltfLoader = loader as GLTFLoader;
    //     const dracoLoader = new DRACOLoader();
    //     dracoLoader.setDecoderPath(
    //         'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //     );
    //     // gltf.setDRACOLoader(dracoLoader);
    //     //     gltfLoader.setDRACOLoader(dracoLoader);
    //     // useGLTF.setDecoderPath(
    //     //     'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    //     // );
    //     console.log('Draco decoder configured globally');
    // }, []);
}
// export const gltfLoader = gltf;
