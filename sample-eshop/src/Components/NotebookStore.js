import React from 'react';
import Notebooks from "./Notebooks";

const NotebookStore = (props) => {
    return (
        <div className="product-page row">
            <div className="flex">
                <Notebooks language={props.language}/>
            </div>
        </div>
    );
}

export default NotebookStore;