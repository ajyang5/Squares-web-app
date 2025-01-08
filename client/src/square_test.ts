import * as assert from 'assert';
import { solid, split, toJson, fromJson, find } from './square';
import { nil, cons } from './list';



describe('square', function() {

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('find', function(){
    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    const s2 = split(solid("red"), s1, solid("green"), s1);
    const s3 = split(solid("white"), s2, solid("orange"), s2);
    const s4 = split(s3, s3, s3, solid("orange"));
    const s5 = split(s4, s3, s4, s4);

    // 0-1-many herustics: 0 recursive call (p=nil base case)
    assert.deepStrictEqual(find(nil, s1), s1);
    assert.deepStrictEqual(find(nil, solid("green")), solid("green"));

    // 0-1-many herustics: 0 recursive call (error case) 
    assert.throws(() => find(cons("NE", cons("SW", nil)), solid("white")), Error);
    assert.throws(() => find(cons("SW", nil), solid("green")), Error);

    // 0-1-many herustics: 1 recursive call (end with p=nil base case)
    assert.deepStrictEqual(find(cons("SW", nil), s1), solid("purple"));
    assert.deepStrictEqual(find(cons("NE", nil), s2), s1);
    assert.deepStrictEqual(find(cons("NW", nil), s2), solid("red"));
    assert.deepStrictEqual(find(cons("SE", nil), s2), s1);

    // 0-1-many herustics: 1 recursive call (end with error case)
    assert.throws(() => find(cons("NE", cons("SW", nil)), s1), Error);
    assert.throws(() => find(cons("NE", cons("SW", cons("SW", nil))), s1), Error);

    assert.throws(() => find(cons("SW", cons("SW", nil)), s1), Error);
    assert.throws(() => find(cons("SW", cons("SW", cons("SW", nil))), s2), Error);

    assert.throws(() => find(cons("NW", cons("SW", nil)), s1), Error);
    assert.throws(() => find(cons("NW", cons("SW", cons("SW", nil))), s2), Error);

    assert.throws(() => find(cons("SE", cons("SW", nil)), s1), Error);
    assert.throws(() => find(cons("SE", cons("SW", cons("SW", nil))), s1), Error);

    // 0-1-many herustics: 2+ recursive calls 
    // NE -> NE
    assert.deepStrictEqual(find(cons("NE", cons("NE", nil)), s3), s1);
    assert.deepStrictEqual(find(cons("NE", cons("NE", cons("SE", nil))), s3), solid("white"));

    // NE -> NW
    assert.deepStrictEqual(find(cons("NE", cons("NW", nil)), s3), solid("red"));
    assert.deepStrictEqual(find(cons("NE", cons("NW", nil)), s2), solid("blue"));

    // NE -> SW
    assert.deepStrictEqual(find(cons("NE", cons("SW", nil)), s3), solid("green"));
    assert.deepStrictEqual(find(cons("NE", cons("SW", nil)), s4), solid("orange"));

    // NE -> SE
    assert.deepStrictEqual(find(cons("NE", cons("SE", nil)), s4), s2);
    assert.deepStrictEqual(find(cons("NE", cons("SE", cons("NE", nil))), s4), s1);

    // NW -> NE
    assert.deepStrictEqual(find(cons("NW", cons("NE", nil)), s4), s2);
    assert.deepStrictEqual(find(cons("NW", cons("NE", cons("NE", nil))), s4), s1);

    // NW -> NW
    assert.deepStrictEqual(find(cons("NW", cons("NW", nil)), s4), solid("white"));
    assert.deepStrictEqual(find(cons("NW", cons("NW", cons("NE", nil))), s5), s2);

    // NW -> SW
    assert.deepStrictEqual(find(cons("NW", cons("SW", nil)), s4), solid("orange"));
    assert.deepStrictEqual(find(cons("NW", cons("SW", cons("SW", nil))), s5), solid("orange"));

    // NW -> SE
    assert.deepStrictEqual(find(cons("NW", cons("SE", nil)), s4), s2);
    assert.deepStrictEqual(find(cons("NW", cons("SE", cons("SW", nil))), s4), solid("green"));

    // SW -> NE
    assert.deepStrictEqual(find(cons("SW", cons("NE", nil)), s4), s2);
    assert.deepStrictEqual(find(cons("SW", cons("SE", cons("SW", nil))), s4), solid("green"));

    // SW -> NW
    assert.deepStrictEqual(find(cons("SW", cons("NW", nil)), s4), solid("white"));
    assert.deepStrictEqual(find(cons("SW", cons("NW", cons("SW", nil))), s5), solid("orange"));

    // SW -> SW
    assert.deepStrictEqual(find(cons("SW", cons("SW", nil)), s4), solid("orange"));
    assert.deepStrictEqual(find(cons("SW", cons("SW", cons("SW", nil))), s5), solid("orange"));

    // SW -> SE
    assert.deepStrictEqual(find(cons("SW", cons("SE", nil)), s4), s2);
    assert.deepStrictEqual(find(cons("SW", cons("SE", cons("SW", nil))), s4), solid("green"));

    // SE -> NE
    assert.throws(() => find(cons("SE", cons("NE", cons("SW", cons("SW", cons("SW", nil))))), s4), Error);
    assert.deepStrictEqual(find(cons("SE", cons("NE", cons("SW", nil))), s3), solid("purple"));

    // SE -> NW
    assert.throws(() => find(cons("SE", cons("NW", cons("SW", cons("SW", cons("SW", nil))))), s3), Error);
    assert.deepStrictEqual(find(cons("SE", cons("NW", nil)), s3), solid("red"));

    // SE -> SW
    assert.deepStrictEqual(find(cons("SE", cons("SW", cons("SW", nil))), s5), solid("orange"));
    assert.deepStrictEqual(find(cons("SE", cons("SW", nil)), s3), solid("green"));

    // SE -> SE
    assert.throws(() => find(cons("SE", cons("SE", cons("NE", nil))), s5), Error);
    assert.deepStrictEqual(find(cons("SE", cons("SE", nil)), s5), solid("orange"));
  });

});
