import * as React from 'react';
import { connect } from 'react-redux'

class LandingPage extends React.Component {
    render() {
        console.log(this.props.count)

        return (
            <div>index page</div>
        );
    }
}


export default (LandingPage);