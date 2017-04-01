import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import marked from 'marked';
import _ from 'lodash';

marked.setOptions({
  breaks: true
});

class MenuItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // e.preventDefault();

    this.props.update(this.props.content);
  }

  render() {
    return (
      <NavItem onClick={this.handleClick}>{this.props.name}</NavItem>
    );
  }
}

class Menu extends Component {

  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            Guide Dog Guide
            </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav>
            {
              this.props.documents.map((doc, idx) => 
                <MenuItem name={doc.name} content={doc.content} update={this.props.update} key={idx} />
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [
        { name: 'Introduction Video', content: ''}
      ],
      selectedContent: ''
    };

    this.selectContent = this.selectContent.bind(this);
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/dbradf/guide-dog-guide-data/master/documents.json').then((response) => {
      return response.json();
    }).then((json) => {
      console.log(json);
      this.setState({
        documents: json.documents
      });
      _.forEach(json.documents, (element, idx) => {
        fetch('https://raw.githubusercontent.com/dbradf/guide-dog-guide-data/master/documents/' + element.location).then((response) => {
          return response.text();
        }).then((body) => {
          const documents = this.state.documents.slice();
          documents[idx].content = marked(body);
          this.setState({
            documents: documents
          });
        });
      }, this);
    })
  }

  selectContent(content) {
    console.log(content);
    this.setState({
      selectedContent: content
    });
  }

  render() {

    return (
      <div className="App">
        <Menu documents={this.state.documents} update={this.selectContent}></Menu>
        <div dangerouslySetInnerHTML={{__html: this.state.selectedContent }}>
        </div>
      </div>
    );
  }
}

export default App;
