export interface CarouselGeneralSettings {
    CONTAINER_SCALE: number;
    // CONTAINER_SCALE: { value: number; min: number; max: number; step: number };
    CARD_SCALE: number;
    // CARD_SCALE: { value: number; min: number; max: number; step: number };
    ACTIVE_CARD: boolean;
    CARD_ANIMATION: {
        value: 'Move_Out' | 'Move_In';
        options: ('Move_Out' | 'Move_In')[];
    };
    CARDS_COUNT: number;
    // CARDS_COUNT: { value: number; min: number; max: number; step: number };
    CARD_SPEED: number;
}
//     CARD_SPEED: { value: number; min: number; max: number; step: number };
// }

export interface BoundariesSettings {
    attachCamera: boolean;
    debug: boolean;
    x: number;
    // x: { value: number; min: number; max: number };
    y: number;
    // y: { value: number; min: number; max: number };
    z: number;
    // z: { value: number; min: number; max: number };
    path: {
        value: 'Circle' | 'Rollercoaster' | 'Infinity' | 'Heart';
        options: ('Circle' | 'Rollercoaster' | 'Infinity' | 'Heart')[];
    };
}

export interface CardsSettings {
    // THREED: { value: boolean };
    THREED: boolean;
    ALIGNMENT: boolean;
    // ALIGNMENT: { value: boolean };
    BENDING: number;
    // BENDING: { value: number; min: number; max: number; step: number };
    y_HEIGHT: number;
    // y_HEIGHT: { value: number; min: number; max: number; step: number };
}

export interface PresenceSettings {
    PRESENCE_CIRCLE: boolean;
    COLLISIONS: boolean;
    PRESENCE_RADIUS: number;
    // PRESENCE_RADIUS: { value: number; min: number; max: number; step: number };
    CARD_WIREFRAME: boolean;
}

export interface SettingsType
    extends CarouselGeneralSettings,
        BoundariesSettings,
        CardsSettings,
        PresenceSettings {
    set: any;
}
