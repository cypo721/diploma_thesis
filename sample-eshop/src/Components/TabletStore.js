import React from 'react';
import Tablets from "./Tablets";

const TabletStore = (props) => {
    return (
        <div className="product-page row">
            <div className="flex">
                <Tablets language={props.language}/>
            </div>
        </div>
    );
}

export default TabletStore;