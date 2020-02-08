import React, { Component } from 'react';


class MainContainer extends Component{
    constructor(props, context) {
        super(props, context);
    
        this.initialize = this.initialize.bind(this);


        this.state = {};
    }
    initialize() {

    }


    render() {
        
        return (
            <div>
                <h2>Hello World</h2>
            </div>
        );
    }
}
export default MainContainer;