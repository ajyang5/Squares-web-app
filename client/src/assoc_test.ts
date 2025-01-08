import * as assert from 'assert';
import { nil, cons } from './list';
import { AssocList, contains_key, get_keys, get_value } from './assoc';


describe('assoc', function() {

  it('contains_key', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.strictEqual(contains_key("a", nil), false);
    assert.strictEqual(contains_key("b", nil), false);
    // 0-1-many: 1 recursive call
    const L0: AssocList<number> = cons(["b", 2], nil);
    assert.strictEqual(contains_key("a", L0), false);
    assert.strictEqual(contains_key("b", L0), true);
    // 0-1-many: 2+ recursive calls
    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["c", 6], cons(["d", 9], nil))));
    assert.strictEqual(contains_key("c", L1), true);
    assert.strictEqual(contains_key("d", L1), false);
    assert.strictEqual(contains_key("d", L2), true);
  });

  it('get_keys', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepStrictEqual(get_keys(nil), nil);
    assert.deepStrictEqual(get_keys(nil), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(get_keys(cons(["a", 1], nil)), cons("a", nil));
    assert.deepStrictEqual(get_keys(cons(["b", 2], nil)), cons("b", nil));
    // 0-1-many: 2+ recursive calls
    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["a", 6], cons(["d", 9], nil))));
    assert.deepStrictEqual(get_keys(L1), cons("a", cons("b", cons("c", nil))));
    assert.deepStrictEqual(get_keys(L2), cons("a", cons("b", cons("d", nil))));
  });

  it('get_value', function() {
    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["c", 6], cons(["d", 9], nil))));
    // 0-1-many: base case, 0 recursive calls
    assert.strictEqual(get_value("a", L1), 1);
    assert.strictEqual(get_value("a", L2), 4);
    // 0-1-many: 1 recursive call
    assert.strictEqual(get_value("b", L1), 2);
    assert.strictEqual(get_value("b", L2), 5);
    // 0-1-many: 2+ recursive calls
    assert.strictEqual(get_value("c", L1), 3);
    assert.strictEqual(get_value("d", L2), 9);
  });

});
