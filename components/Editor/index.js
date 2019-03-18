import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState()
    };
  }

  render() {
    return (
      <BraftEditor value={this.state.editorStste} onChange={this.handleChange} />
    )
  }

  handleChange = (editorStste) => {
    this.setState({ editorStste })
  }

}