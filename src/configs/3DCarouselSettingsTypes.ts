export interface CarouselGeneralSettings {
    CONTAINER_SCALE: number;
    CARD_SCALE: number;
    ACTIVE_CARD: boolean;
    CARD_ANIMATION: {
        value: 'Move_Out' | 'Move_In';
        options: ('Move_Out' | 'Move_In')[];
    };
    CARDS_COUNT: number;
    CARD_SPEED: number;
}

export interface BoundariesSettings {
    attachCamera: boolean;
    debug: boolean;
    x: number;
    y: number;
    z: number;
    path: {
        value: 'Circle' | 'Rollercoaster' | 'Infinity' | 'Heart';
        options: ('Circle' | 'Rollercoaster' | 'Infinity' | 'Heart')[];
    };
}

export interface CardsSettings {
    THREED: boolean;
    ALIGNMENT: boolean;
    BENDING: number;
    y_HEIGHT: number;
}

export interface PresenceSettings {
    PRESENCE_CIRCLE: boolean;
    DEBUG_SPHERE_WIREFRAME: boolean;
    COLLISIONS: boolean;
    PRESENCE_RADIUS: number;
    CARD_WIREFRAME: boolean;
}

export interface SettingsType
    extends CarouselGeneralSettings,
        BoundariesSettings,
        CardsSettings,
        PresenceSettings {
    set: any;
}
