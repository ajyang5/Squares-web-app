import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { mutableMap, makeMap } from "./map";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// keeps track of the files
const files: mutableMap = makeMap();


/** 
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({greeting: `Hi, ${name}`});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};


/**
 * Saves the “content” of a file under a given "name".
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const content = req.body.content;
  if (content === undefined) {
    res.status(400).send('required argument "content" was missing');
    return;
  }

  files.setValue(content, name);
  const saved: boolean = files.containsValue(name);
  res.send({saved: saved});
}

/**
 * loads the last-saved content of a file with a given "name".
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if (!files.containsValue(name)) {
    res.status(404).send('no file previously saved with this name');
    return;
  }

  const content = files.getValue(name);
  res.send({name: name, content: content});
}

/** lists the names of all files currently saved. */
export const names = (_req: SafeRequest, res: SafeResponse): void => {
  const nameList: Array<string> = files.getKeys();
  res.send({names: nameList});
}


/** 
 * Used in tests to set the transcripts map back to empty. 
 */
export const resetFilesForTesting = (): void => {
  files.clearAll();
};
