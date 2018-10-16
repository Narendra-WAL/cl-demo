import React, { Component } from 'react';
import github from 'octonode';
import { ipcRenderer } from 'electron';
import MainContent from './mainContent/mainContent';
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';

export default class GithubScreen extends Component {
  constructor (props){
    super(props)
    this.state = {
      activeTab: '1',
      mainContent: []
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleChange = e => console.log(e.target.value);

  validateUrl = (e) => {
    // Validate URL - Check if the URL is a proper Github URL
    var urlValue = document.getElementById('githubUrl').value;
    console.log(urlValue);
    if(urlValue.trim().length == 0 || !urlValue.startsWith("https://github.com/")) {
      console.log("Please enter a valid Github URL.");
      return;
    }

    var client = github.client();

    client.get('/users/pksunkara', {}, function (err, status, body, headers) {
      //console.log(body); //json object
    });

    var ghrepo = client.repo('octokit/octokit.rb');
    ghrepo.prs({}, (err, body, headers) => {
      //map func
      let gitAnalyser = body.map((gitContent) => {
        // console.log(gitContent.url);
        return (gitContent)
      })
      //arr to setstate
      this.setState({
        mainContent: gitAnalyser
      })
      console.log(body); //json object
      ipcRenderer.send('received:prs', body);
    })

    ghrepo.contributors((err, body, headers) => {
      console.log("Contributors: " + JSON.stringify(body)); //json object
      ipcRenderer.send('received:contributors', body);
    })
  }

  getRepoInfo = () => {

  }

  render() {
    console.log(this.state.mainContent);
    let contentArr = this.state.mainContent.map((content,index) => {
      console.log("content",content);
        return (
          <MainContent  key={index} 
                        url={content.url}/> 
        )
    });
    
    return (
      <div className="analyzer-wrapper">
        <div className="analyzer-input">
          <input id="githubUrl" placeholder="Github URL" onChange={this.handleChange} />
          <button color="blue" onClick={this.validateUrl}>Analyze</button>
        </div>
        {this.state.mainContent.length > 0 ? 
          <div className="main-wrapper">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Pull Requests
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Contributors
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                {contentArr}
              </TabPane>
              <TabPane tabId="2">
                Nothings out here for now
              </TabPane>
            </TabContent>
          </div>
          : 
          <React.Fragment>
            <p>Please Type something in search PR's and Contributors</p>
          </React.Fragment>
        }
      </div>
    );
  }
}
