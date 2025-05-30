export class UniqueSet {
    // /** @type {Map} */
    #map = new Map();

    /**
     * Permet de créer un Map ayant le comportement d'un Set
     * en désignant quelle propriété de l'objet sera unique
     * @param cb - Désignez la clé qui ne pourra pas être dubliquée.
     * Cette clé servira pour toutes les fonctions
     * @param items - L'objet qui sera Map
     */
    constructor(cb = (item = null) => null, items = []) {
        if (!items) return;
        items.forEach((item) => {
            if (!this.#map.has(cb(item))) this.#map.set(cb(item), item);
        });
    }

    /**
     * Supprime un élément du Map
     * @param key
     */
    delete(key) {
        this.#map.delete(key);
    }

    clear() {
        this.#map.clear();
    }

    size() {
        return this.#map.size;
    }

    entries() {
        return this.#map.entries();
    }

    has(key) {
        if (this.#map.has(key)) {
            return true;
        }
        return false;
    }

    get(key) {
        return this.#map.get(key);
    }

    forEach(cb) {
        this.#map.forEach(cb);
    }

    set(key, items) {
        if (this.#map.has(key)) {
            let mappedItem = this.#map.get(key);
            for (const [element, value] of Object.entries(items)) {
                mappedItem[element] = value;
            }
            this.#map.set(key, mappedItem);
        } else {
            this.#map.set(key, items);
        }
    }

    values() {
        return this.#map.values();
    }
}
