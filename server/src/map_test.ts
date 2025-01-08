import * as assert from 'assert';
import { makeMap, mutableMap } from './map';


// TODO (5e): copy over your mutable map tests from HW7
//            add tests for the function that gets all the keys in the map

describe('map', function() {
  // Creates an empty mutable map.
  const Map1: mutableMap = makeMap();

  it('containsValue', function() {
    // straight-line code, 1 subdomain
    assert.deepStrictEqual(Map1.containsValue("a"), false);
    Map1.setValue(1, "b");
    Map1.setValue(3, "b");
    assert.deepStrictEqual(Map1.containsValue("b"), true);
  });

 

  it('getValue', function() {
   // straight-line code
   assert.deepStrictEqual(Map1.getValue("b"), 3);
   Map1.setValue(5, "a");
   assert.deepStrictEqual(Map1.getValue("a"), 5);

   // check the error is thrown correctly
   assert.throws(() => Map1.getValue("c"), Error);
   assert.throws(() => Map1.getValue("e"), Error);
  });

  it('setValue', function() {
    // straight-line code, 1 subdomain
    assert.deepStrictEqual(Map1.setValue(3, "k"), false);
    assert.deepStrictEqual(Map1.getValue("k"), 3);

    assert.deepStrictEqual(Map1.setValue(7, "b"), true);
    assert.deepStrictEqual(Map1.getValue("b"), 7);
   });

   it('clearAll', function() {
    // straight-line code, 1 subdomain
    Map1.setValue(7, "b");
    Map1.clearAll();
    assert.deepStrictEqual(Map1.containsValue("b"), false);

    Map1.setValue(17, "a");
    Map1.setValue(344, "m");
    Map1.clearAll();
    assert.deepStrictEqual(Map1.containsValue("m"), false);
    assert.deepStrictEqual(Map1.containsValue("a"), false);
   });

   it('getKeys', function() {
    // straight-line code, 1 subdomain
    Map1.setValue(7, "b");
    Map1.setValue(17, "k");
    assert.deepStrictEqual(Map1.getKeys(), ["b", "k"]);

    Map1.clearAll();
    assert.deepStrictEqual(Map1.getKeys(), []);
   });
});
