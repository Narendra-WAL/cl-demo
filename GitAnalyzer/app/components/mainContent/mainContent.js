import React, { Component } from 'react';
import styles from './_main-content.css';

class MainContent extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div className={styles.mainContentWrapper}>
                {this.props.url}
            </div>
        )
    }
}

export default MainContent;