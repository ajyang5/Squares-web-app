import { isRecord } from './record';
import { Square, fromJson, toJson } from './square';


///////////////////////////////////////////////////////////////////////////////
// Exported functions: call these in your App.tsx code to access the server.
// Read the documentation to understand their inputs and outputs, no need to
// spend time understanding the code itself yet.
///////////////////////////////////////////////////////////////////////////////

/** Type of callback that receives the list of file names */
export type ListCallback = (names: string[]) => void;

/** 
 * Acccesses /names server endpoint and recieves list of files.
 * Passes list to the given callback.
 * @param cb callback that accepts a string[] of file names as its param.
 *           Called when server response is received and parsed.
 */
export const listFiles = (cb: ListCallback): void => {
  fetch("/api/names")
    .then((res) => doListResp(res, cb))
    .catch(() => doListError("failed to connect to server"));
};


/** Type of callback that receives file contents (a Square) and its name */
export type LoadCallback = (name: string, sq: Square | null) => void;

/** 
 * Acccesses /load server endpoint, passing given "name" as a query param,
 * and recieves file contents for file name.
 * Passes file contents to the given callback.
 * @param name of file to get contents of
 * @param cb callback that accepts a file name and its contents.
 *           Called when server response is received and parsed.
 */
export const loadFile = (name: string, cb: LoadCallback): void => {
  fetch("/api/load?name=" + encodeURIComponent(name))
    .then((res) => doLoadResp(name, res, cb))
    .catch(() => doLoadError("failed to connect to server"));
}


/** Type of callback that accepts save notification for file with given name */
export type SaveCallback = (name: string, saved: boolean) => void;

/** Stores the contents of the given file on the server. */
/** 
 * Acccesses /save server endpoint, passing given "name" and square file 
 * "contents" in the BODY of the request. Recieves confirmation on completion.
 * Passes confirmation of save success to the given callback.
 * @param name of file to get contents of
 * @param cb callback that accepts a file name and its contents.
 *           Called when server response is received and parsed.
 */
export const saveFile = (name: string, sq: Square, cb: SaveCallback): void => {
  const body = {name: name, content: toJson(sq)};
  fetch("/api/save", {method: 'POST', body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}})
    .then((res) => doSaveResp(name, res, cb))
    .catch(() => doSaveError("failed to connect to server"));
};



///////////////////////////////////////////////////////////////////////////////
// Helper functions: no need to read or access these
///////////////////////////////////////////////////////////////////////////////

// Accessing /list route helpers

// Called when the server responds with to a request for the file names.
const doListResp = (res: Response, cb: ListCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doListJson(val, cb))
      .catch(() => doListError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doListError)
      .catch(() => doListError("400 response is not text"));
  } else {
    doListError(`bad status code: ${res.status}`);
  }
};

// Called when the new question response JSON has been parsed.
const doListJson = (val: unknown, cb: ListCallback): void => {
  if (!isRecord(val) || !Array.isArray(val.names)) {
    console.error('Invalid JSON from /api/names', val);
    return;
  }

  const names: string[] = [];
  for (const name of val.names) {
    if (typeof name === 'string') {
      names.push(name);
    } else {
      console.error('Invalid name from /api/names', name);
      return;
    }
  }

  cb(names);
};

// Called if an error occurs trying to get a new question.
const doListError = (msg: string): void => {
  console.error(`Error fetching /api/names: ${msg}`);
};

// Accessing /load route helpers

// Called when the server responds to a request to load
const doLoadResp = (name: string, res: Response, cb: LoadCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doLoadJson(name, val, cb))
      .catch(() => doLoadError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doLoadError)
      .catch(() => doLoadError("400 response is not text"));
  } else {
    doLoadError(`bad status code: ${res.status}`);
  }
};

// Called when the load response JSON has been parsed.
const doLoadJson = (name: string, val: unknown, cb: LoadCallback): void => {
  if (!isRecord(val) || typeof val.name !== 'string' ||
      val.content === undefined) {
    console.error('Invalid JSON from /api/load', val);
    return;
  }

  if (val.content === null) {
    cb(name, null);
  } else {
    cb(name, fromJson(val.content));
  }
};

// Called if an error occurs trying to save the file
const doLoadError = (msg: string): void => {
  console.error(`Error fetching /api/load: ${msg}`);
};

// Accessing /save route helpers

// Called when the server responds to a request to save
const doSaveResp = (name: string, res: Response, cb: SaveCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doSaveJson(name, val, cb))
      .catch(() => doSaveError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doSaveError)
      .catch(() => doSaveError("400 response is not text"));
  } else {
    doSaveError(`bad status code: ${res.status}`);
  }
};

// Called when the save response JSON has been parsed.
const doSaveJson = (name: string, val: unknown, cb: SaveCallback): void => {
  if (!isRecord(val) || typeof val.saved !== 'boolean') {
    console.error('Invalid JSON from /api/save', val);
    return;
  }

  cb(name, val.saved);
};

// Called if an error occurs trying to save the file
const doSaveError = (msg: string): void => {
  console.error(`Error fetching /api/save: ${msg}`);
};