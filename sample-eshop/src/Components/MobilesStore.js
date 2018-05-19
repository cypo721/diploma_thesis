import React from 'react';
import Mobiles from "./Mobiles";

const MobileStore = (props) => {
    return (
        <div className="product-page row">
            <div className="flex">
                <Mobiles language={props.language}/>
            </div>
        </div>
    );
}

export default MobileStore;