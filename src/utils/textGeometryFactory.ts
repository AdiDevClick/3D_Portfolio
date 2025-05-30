import { mergeBufferGeometries, TextBufferGeometry } from 'three-stdlib';
import { importedFont } from '@/configs/3DFonts.config';
import { FontData } from '@react-three/drei';
import { UniqueSet } from '@/utils/UniqueSet';
import { BufferGeometry } from 'three';

export class TextGeometryFactory {
    /** Cache for each char to avoid re-creating them */
    #charCache = new UniqueSet();
    /** Cache for each word to avoid re-creating them */
    #wordCache = new UniqueSet();
    #font: FontData = importedFont;
    options: { isMobile?: boolean; [key: string]: any };
    #text: string = '';
    #size = 40;
    #letterSpacing = 2;
    #isMobile: boolean;
    #defaultConfig = {
        height: 3,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 1,
        bevelOffset: 0.2,
        bevelSegments: 4,
    };

    #mobileConfig = {
        ...this.#defaultConfig,
        // height: 0.5,
        // depth: 0,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
    };
    #config = { font: this.#font, size: this.#size };
    #textGeometry: TextBufferGeometry | null = null;
    #charGeometriesBuffer: BufferGeometry[] = [];

    // #config: object = { ...this.#defaultConfig };

    /**
     * Initialize the geometry with a specific text and options
     *
     * @param text - The text to create the geometry for
     * @param options - Options for the geometry creation
     */
    // constructor(text = null, options = {}) {
    //     this.options = Object.assign(
    //         {},
    //         {
    //             isMobile: false,
    //         },
    //         options
    //     );
    //     this.#text = text ?? '';
    //     // this.#size = options.size;
    //     this.#isMobile = this.options.isMobile ?? false;
    //     // this.#cacheCharGeometry.bind(this);
    //     // this.#create.bind(this, this.#text);
    // }

    // #cacheCharGeometry() {
    #getCharGeometry(char: string): TextBufferGeometry {
        const key = `${char}-${this.#isMobile}`;

        if (this.#charCache.has(key)) {
            return this.#charCache.get(key);
        }

        const charGeometry = new TextBufferGeometry(char, this.#config);

        if (
            !charGeometry.attributes.position ||
            charGeometry.attributes.position.count === 0
        ) {
            throw new Error(`Failed to create geometry for character: ${char}`);
        }

        charGeometry.computeBoundingBox();
        charGeometry.computeVertexNormals();

        this.#charCache.set(key, charGeometry);

        return charGeometry;
    }

    #getTextGeometry() {
        // console.log('textGeometryFactory', this.#text);

        // const { textProps = {} } = this.options;
        const key = `merged-${this.#text}-${this.#isMobile}-${
            this.#letterSpacing
        }`;
        // const key = `merged-${this.#text}-${this.#size}-${
        //     this.#isMobile
        // }-${JSON.stringify(textProps)}`;
        // const mergedGeometry = mergeBufferGeometries(key);

        if (this.#wordCache.has(key)) {
            return this.#wordCache.get(key);
        }

        this.#config = this.#isMobile
            ? { ...this.#config, ...this.#mobileConfig }
            : { ...this.#config, ...this.#defaultConfig };

        return this.#createTextGeometry(key);
    }

    /**
     * Creates a TextBufferGeometry for the given text
     *
     * @param text - The text to create the geometry for
     * @param key - A unique key to identify the geometry
     * @returns The created TextBufferGeometry
     */
    #createTextGeometry(key: string) {
        let offsetX = 0;
        this.#text.split('').forEach((char) => {
            if (char === ' ') return (offsetX += this.#letterSpacing * 10);
            const originalGeo = this.#getCharGeometry(char);
            const charGeo = originalGeo.clone();
            // this.#positionCharGeometries(charGeo);
            charGeo.translate(offsetX, 0, 0);
            this.#charGeometriesBuffer.push(charGeo);

            if (charGeo.boundingBox) {
                const width =
                    charGeo.boundingBox.max.x - charGeo.boundingBox.min.x;
                offsetX += width + this.#letterSpacing;
            }
        });

        this.#textGeometry = mergeBufferGeometries(this.#charGeometriesBuffer);

        // if (!this.#textGeometry) {
        //     throw new Error(
        //         `Failed to merge geometries for text: ${this.#text}`
        //     );
        // }
        // let offsetX = 0;
        // this.#textGeometry = new TextBufferGeometry(this.#text, this.#config);

        this.#textGeometry.computeBoundingBox();
        this.#textGeometry.computeVertexNormals();

        this.#charGeometriesBuffer.forEach((geo) => geo.dispose());
        this.#charGeometriesBuffer = [];

        this.#wordCache.set(key, this.#textGeometry);
        // this.#charCache.set(key, this.#textGeometry);

        return this.#textGeometry;
    }

    #positionCharGeometries(
        char: TextBufferGeometry,
        spacing = this.#letterSpacing
    ) {
        if (!char) return;
        let offsetX = 0;

        // const bbox = char.boundingBox!;
        // offsetX += bbox.max.x - bbox.min.x + spacing;

        const { boundingBox } = char;
        // const { boundingBox } = this.#textGeometry;
        if (!boundingBox) return;

        const { min, max } = boundingBox;

        const width = max.x - min.x;
        const height = max.y - min.y;

        offsetX += width + spacing;

        char.translate(offsetX, 0, 0);
        this.#charGeometriesBuffer.push(char);

        // this.#textGeometry.translate(-width / 2, -height / 2, 0);
    }

    getStats() {
        const charVertices = Array.from(this.#charCache.values()).reduce(
            (sum, geo) => sum + geo.attributes.position.count,
            0
        );

        const wordVertices = Array.from(this.#wordCache.values()).reduce(
            (sum, geo) => sum + geo.attributes.position.count,
            0
        );

        return {
            charCache: this.#charCache.size,
            wordCache: this.#wordCache.size,
            charVertices,
            wordVertices,
            totalVertices: charVertices + wordVertices,
        };
    }

    dispose() {
        this.#charCache.forEach((geometry) => geometry.dispose());
        this.#wordCache.forEach((geometry) => geometry.dispose());
        this.#charCache.clear();
        this.#wordCache.clear();
    }

    setTextGeometry(text: string, isMobile: boolean) {
        this.#text = text;
        this.#isMobile = isMobile;

        return this.#getTextGeometry();
    }
}
