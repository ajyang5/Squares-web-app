import React, { Component, ChangeEvent } from "react";
import { Square, Path, find, replace, split, solid, toColor  } from './square';
import { SquareElem } from "./square_draw";
import { len, prefix } from "./list";


type FileEditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  name: string;

  /** Called to ask parent to save file contents in server. */
  onSave: (name: string, root: Square) => void;
  onBack: () => void;
};


type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};


/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);

    this.state = { root: props.initialState };
  }

  // Shows contents on the screen
  render = (): JSX.Element => {
    if (this.state.selected !== undefined) {
      return (<div>
        <SquareElem width={600n} height={600n}
                    square={this.state.root} selected={this.state.selected}
                    onClick={this.doSquareClick}></SquareElem>
        <h2>Tools</h2>
        <button onClick={this.doSplitClick}>Split</button>
        <button onClick={this.doMergeClick}>Merge</button>
        <select onChange={this.doColorChange}>
          <option value = "">COLOR</option>
          <option value = "white">White</option>
          <option value = "red">Red</option>
          <option value = "orange">Orange</option>
          <option value = "yellow">Yellow</option>
          <option value = "green">Green</option>
          <option value = "blue">Blue</option>
          <option value = "purple">Purple</option>
        </select>
        <div>
        <button onClick={this.doSaveClick}>Save</button>
        <button onClick={this.doBackClick}>Back</button>
        </div>
      </div>);
    } else {
      return (<div>
        <SquareElem width={600n} height={600n}
                    square={this.state.root} selected={this.state.selected}
                    onClick={this.doSquareClick}></SquareElem>
        <h2>Tools</h2>
        <button onClick={this.doSaveClick}>Save</button>
        <button onClick={this.doBackClick}>Back</button>
      </div>);
    }
  };

  // Called when the user clicked a square. Updating the current selected path
  doSquareClick = (path: Path): void => {
    this.setState({selected: path});
  }

  // Called when the user clicks the split button. 
  // Splits the selected square into four smaller squares. 
  // Throws an error if no square is selected.
  doSplitClick = (): void => {
    if (this.state.selected !== undefined) {
      const selectedRoot = find(this.state.selected, this.state.root);

      const newRoot = replace(this.state.selected, this.state.root, 
                          split(selectedRoot, selectedRoot, selectedRoot, selectedRoot));
      this.setState({ root: newRoot, selected : undefined });
    } else {
      throw new Error('No square is selected.');
    }
  };

  // Merges the the square (with the given path) with its siblings 
  // when the merge button is clicked.
  // If no square is selected, throw an error
  doMergeClick = (): void => {
    const path = this.state.selected;
    if (path !== undefined) {
      const selectedRoot = find(path, this.state.root);

        const parentPath = prefix(len(path)-1n, path);
        const newRoot = replace(parentPath, this.state.root, selectedRoot);
        this.setState({ root: newRoot, selected : undefined });
    } else {
      throw new Error('No square is selected.');
    }
  };

  // Changes the color of the square with the given path to the user-picked color
  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    const path = this.state.selected;
    if (path !== undefined) {
      const newRoot = replace(path, this.state.root, solid(toColor(evt.target.value)));
      this.setState({ root: newRoot, selected: undefined });
    } else {
      throw new Error('No square is selected.');
    }
  };

  // Saves the square when the save button is clicked
  doSaveClick = (): void => {
    this.props.onSave(this.props.name, this.state.root);
  };

  // Goes back to the picking page when the back button is clicked
  doBackClick = (): void => {
    this.props.onBack();
  };  
}
