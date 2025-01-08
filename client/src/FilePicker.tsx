import React, { Component, ChangeEvent } from "react";


type FilePickerProps = {
  /** Called to ask parent to open the editor. */
  onCreate: (name: string) => void;
  onOpen: (name: string) => void;
  fileNames: Array<string>;
};


type FilePickerState = {
  name: string;  // text in the name text box
};

/** Displays the list of created design files. */
export class FilePicker extends Component<FilePickerProps, FilePickerState> {

  constructor(props: FilePickerProps) {
    super(props);

    this.state = {name: ''};
  }

  // Shows contents on the screen
  render = (): JSX.Element => {
    return (<div>
        <h3>Files</h3>
        {/* TODO: Render file links & textbox for creating a file here */}
        <p>Name:
          <input type="text" value={this.state.name}
              onChange={this.doNameChange} />
          <button type="button" onClick={this.doCreateClick}>Create</button>
        </p>
        <ul>
          {this.renderFileNames()}
        </ul>
      </div>);
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value});
  };

  // Updates the UI to show the file editor
  doCreateClick = (): void => {
    this.props.onCreate(this.state.name);
  };

  // Creates an array of items for the file list
  renderFileNames = (): JSX.Element[] => {
    const names: JSX.Element[] = [];
    for (const name of this.props.fileNames) {
      names.push(
        <li key={name}>
          <a href="#" onClick={(evt) => this.doItemClick(evt, name)}>{name}</a>
       </li>);
    }
    return names;
  };
  
  // Opens the square files when the link is clicked
  doItemClick = (_evt: React.MouseEvent<HTMLAnchorElement>, name: string): void => {
    this.props.onOpen(name);
  }
}
