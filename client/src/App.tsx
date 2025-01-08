import React, { Component } from "react";
import { solid, split, Square } from './square';
import { FileEditor } from './FileEditor';
import { FilePicker } from "./FilePicker";
import { saveFile, listFiles, loadFile } from "./server";


/** Describes set of possible app page views */
type Page = {kind: "picking"} | {kind: "editor", square: Square, name: string}; // TODO: modify to set of relevant page states         

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
  names: Array<string>;
  loading: boolean;
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {show: {kind: "picking"}, names: [], loading: true}; // TODO: initialize starting view
  }

  // Updates the list of all names
  componentDidMount = (): void => {
    listFiles(this.doListResp);
  };

  // Shows contents on the screen
  render = (): JSX.Element => {
    // TODO (Q2): Replace return with commented out line to render full editor
    //            component instead of always a static square
    

    // TODO (Q4): render the correct component or loading message depending on 
    // current view instead of always displaying editor
    if (this.state.loading === true) {
      return <p>Loading...</p>;
    } else if (this.state.show.kind === "picking") {
      return <FilePicker onCreate={this.doCreateClick} onOpen={this.doLinkClick} fileNames={this.state.names}/>
    } else {
      return <FileEditor initialState={this.state.show.square} 
                        name={this.state.show.name} 
                        onSave={this.doSaveClick} 
                        onBack={this.doBackClick}/>
    }
  };

  // doSquareClick = (path: Path): void => {
    // console.log(path);
    // alert("Stop that!");
  // };


  // TODO: write functions here to handle switching between app pages and
  //       for accessing server through server.ts helper functions

  // Saves the square under its name
  doSaveClick = (name: string, root: Square): void => {
    this.setState({loading: true, show: {kind: "editor", square: root, name: name}});
    saveFile(name, root, this.doSaveResp);
  }
  
  // Called when the save file response is received; 
  // Updates the name list and informs the user when the save is failed
  doSaveResp = (name: string, saved: boolean): void => {
    listFiles(this.doListResp);
    if (saved === false) {
      alert("The file called " + name + " is not saved successfully!");
    }
  };

  // Called when the list file response is received;
  // updates the name list and sets loading status back to false
  doListResp = (names: string[]): void => {
    this.setState({names: names, loading: false});
  }

  // Creates a new square under the given name if the name is not empty/all spaces; 
  // opens the editor page for the sqaure
  doCreateClick= (name: string): void => {
    if (name.trim() === "") {
      alert("empty name!");
    } else {
      const sq: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
      this.setState({show: {kind: "editor", square: sq, name: name}});
    }
  }

  // Goes back to the picking page
  doBackClick= (): void => {
    this.setState({show: {kind: "picking"}});
  }

  // Loades the sqaure with the given name from the server
  doLinkClick = (name: string): void => {
    this.setState({loading: true});
    loadFile(name, this.doLoadResp);
  }

  // Calls when the load file response is received
  // Opens the editor page for the square with the given name if exsited;
  // otherwise, shows an alert
  doLoadResp = (name: string, sq: Square | null): void => {
    this.setState({loading: false});
    if (sq === null) {
      alert("No square associated with this name!");
    } else {
      this.setState({show: {kind: "editor", square: sq, name: name}});
    }
  }
}
