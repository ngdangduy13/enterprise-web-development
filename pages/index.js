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


const mapState = state => ({
    count: state.userProfile
})

const mapDispatch = ({ userProfile }) => ({
    increment: () => userProfile.increaseNumber(),
})

export default connect(mapState, mapDispatch)(LandingPage);