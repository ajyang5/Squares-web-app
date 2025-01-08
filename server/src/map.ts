// TODO (Q5): 
//  a) Copy over your mutable map interface from HW7
//  b) Add a function that gets all the keys from the map
//  c) Create a class that implements the interface with a TS Map as its field
//  d) Implement a factory function that creates a new instance of the class


/**
 * Represents a map.
 */
export interface mutableMap {
    /**
   * Check if there is some value associated with a given key in the object.
   * @param key The given key to check if it has an associated value in the object
   * @returns contains-key(key, obj)
   */
    containsValue: (key: string) => boolean;
  
    /**
    * Gets the value paired with the first instance of the given key 
    * in the object
    * @param key key to find the corresponding value for
    * @returns get-value(key, obj)
    * @throws Error when !contains-key(key, obj)
    */
    getValue: (key: string) => unknown;

    /**
    * Set a value for a given key in the object, replacing the current value if a pair with the given key already exists. 
    * Return a boolean indicating if a value was replaced.
    * @param val the value that key's value will be set to
    * @param key the key whose value will be set to val in the object
    * @returns a boolean indicating if a value was replaced.
    * @modifies obj
    * @effects obj = cons({key, val}, obj)
    */
    setValue: (val: unknown, key: string) => boolean;
    
    /**
    * Clear all pairs from the object
    * @modifies obj
    * @effects obj = nil
    */
    clearAll: () => void;

    /**
     * Gets set of unique keys in the object.
     * @returns an array containing the keys from all the (key, value) pairs in the object
     */
    getKeys: () => Array<string>;
  }


  
// Implementation of the mutableMap interface with a Map
class theMutableMap implements mutableMap {
    // AF: obj = this.map
    private map: Map<string, unknown>;
  
    // @effect obj = empty Map
    constructor() {
      this.map = new Map();
    }

    containsValue = (key: string): boolean => {
        return this.map.has(key);
    }

    getValue = (key: string): unknown => {
      if (!this.containsValue(key)) {
        throw new Error('Key is not found.');
      }
        return this.map.get(key);
    }

    setValue = (val: unknown, key: string): boolean => {
        const replacement: boolean = this.containsValue(key);
        this.map.set(key, val);
        return replacement;
    }

    clearAll = (): void => {
        this.map = new Map();
    }

    getKeys = (): Array<string> => {
        const itr = this.map.keys();
        return Array.from(itr);
    }
  }

// An empty mutable map.
const newMap: mutableMap = new theMutableMap();

/**
 * Returns an instance of theMutableMap class.
 * @returns an instance of theMutableMap class.
 */
export const makeMap = (): mutableMap => {
  return newMap;
};