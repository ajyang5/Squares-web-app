import { List } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** 
 * Converts a string to a color (or throws an exception if not a color). 
 * @param s string to convert to color
 */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** 
 * Returns a solid square of the given color. 
 * @param color of square to return
 * @returns square of given color
 */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** 
 * Returns a square that splits into the four given parts. 
 * @param nw square in nw corner of returned square
 * @param ne square in ne corner of returned square
 * @param sw square in sw corner of returned square
 * @param se square in se corner of returned square
 * @returns new square composed of given squares
 */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};

export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/** 
 * Creats a JSON representation of given Square. 
 * @param sq to convert to JSON
 * @returns JSON describing the given square
 */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** 
 * Converts a JSON description to the Square it describes. 
 * @param data in JSON form to try to parse as Square
 * @returns a Square parsed from given data
 */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}

/**
 * Retrieve the root of the subtree at that location if it exists. Otherwise,
 * return an error message
 * @param p the path to the root of the square's subtree
 * @param square the square whose root of the subtree will be retried
 * @returns the root of the subtree at that location if it exists
 * @throws error when p is not nil but square is solid
 */
export const find = (p: Path, square: Square): Square => {
  if (p.kind === "nil") {
    return square;
  } else {
    if (square.kind === "solid") {
      throw new Error("The root at the give location does not exist.");
    } else {
      if (p.hd === "NW") {
        return find(p.tl, square.nw);
      } else if (p.hd === "NE") {
        return find(p.tl, square.ne);
      } else if (p.hd === "SW") {
        return find(p.tl, square.sw);
      } else {
        return find(p.tl, square.se);
      }
    }
  }
}

/**
 * Given a square, a path, and a second square, return a new square 
 * that is the same as the first one except that the subtree whose 
 * root is at the given path is replaced by the second square.
 * @param p the path to the root of the first square's subtree
 *          that will be replaced by the second square
 *          in the returned square
 * @param square the first square
 * @param squareNew the second square
 * @returns a new square that is the same as the first one 
 *          except that the subtree whose root is at the given path
 *          is replaced by the second square.
 * @throws error when the path is not nil but square is solid
 */
export const replace = (p: Path, square: Square, squareNew: Square): Square => {
  if (p.kind === "nil") {
    return squareNew;
  } else {
    if (square.kind === "solid") {
      throw new Error("The square is empty.");
    } else {
      if (p.hd === "NW") {
        return {kind: "split", nw: replace(p.tl, square.nw, squareNew), ne: square.ne, sw: square.sw, se: square.se};
      } else if (p.hd === "NE") {
        return {kind: "split", nw: square.nw, ne: replace(p.tl, square.ne, squareNew), sw: square.sw, se: square.se};
      } else if (p.hd === "SW") {
        return {kind: "split", nw: square.nw, ne: square.ne, sw: replace(p.tl, square.sw, squareNew), se: square.se};
      } else {
        return {kind: "split", nw: square.nw, ne: square.ne, sw: square.sw , se: replace(p.tl, square.se, squareNew)};
      }
    }
  }
}