import React from 'react';
import { translate } from 'react-translate'
/*
Contact page.
 */
const Contacts = (props) => {
        return (
            <div className="container" >
                <div className="row">
                    <div className="col-md-12" >
                        <h2>{props.t("author")}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12"><b>{props.t("description")}</b></div>
                </div>
                <div className="row">
                    <div className="col-md-11 col-md-offset-1">{props.t("name")}</div>
                    <div className="col-md-11 col-md-offset-1">{props.t("mail")}</div>
                </div>
                    <br/>
                    <hr/>
                    <br/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row"><b>{props.t("descKentico")}</b></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-11 col-md-offset-1">{props.t("address")}</div>
                    <div className="col-md-11 col-md-offset-1">{props.t("city")}</div>
                    <div className="col-md-11 col-md-offset-1">{props.t("state")}</div>
                </div>
            </div>);
}

export default translate("Contacts")(Contacts);