import Client from "../Client.js";
import CommerceClient from "../CommerceClient"
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let tablets = initLanguageCodeObject();
let comTablets;

let notifyChange = () => {
    changeListeners.forEach((listener) => {
        listener();
    });
};

const request = {
    uri: '/kentico-cloud-integration-63/product-projections/search?filter=productType.id:"a357a12d-49ae-4180-9c3f-d0b671c0e0e0"',
    method: 'GET',
};

let fetchTablets = (language) => {
    console.log("query " + language);
    var query = Client.items()
        .type('tablet');

     if (language) {
       query.languageParameter(language);
     }
     //method: 'GET',
    //mode: 'no -cors',
    // fetch('http://commercetoolsintegration.azurewebsites.net/api/auth',{
    //     method: 'GET',
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET'
    //         // 'Access-Control-Allow-Headers': 'Content-Type'
    //     },
    //     mode: 'cors'
    //     }).then(response => response.json())
    //     .then(jsondata => console.log(jsondata));
    CommerceClient.execute(request)
        .then(result => {
            console.log(result);
            tablets[language] = result;
            query.get()
                .subscribe(response => {
                    var res = [];
                    if (language) {
                        comTablets = tablets[language];
                        tablets[language] = response.items;
                        console.log(response.items);
                        comTablets.body.results.forEach(function(el){
                            var match = tablets[language].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            if (match) {
                                el = Object.assign(match, el);
                                console.log(el);
                                res.push(el);
                            }
                        })
                        console.log(res);
                        tablets[language] = res;
                        console.log(tablets[language]);

                    } else {
                        comTablets = tablets[defaultLanguage];
                        tablets[defaultLanguage] = response.items;
                        comTablets.body.results.forEach(function(el){
                            var match = tablets[defaultLanguage].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            el = Object.assign(match, el);
                            console.log(el);
                            res.push(el);
                        });
                        console.log(res);
                        tablets[defaultLanguage] = res;
                        console.log(tablets[defaultLanguage]);
                    }

                    notifyChange();
                });
        });

}

export class Filter {
    matches(tablet) {
        return true;
    }

}

let tabletFilter = new Filter();

class TabletStore {

    // Actions

    provideTablet(tabletSlug, language) {
        fetchTablets(language);
    }

    provideTablets(language) {
        fetchTablets(language);
    }

    // Methods

    getTablet(tabletSlug, language) {
        console.log(tabletSlug);
        return tablets[language || defaultLanguage].find((tablet) => tablet.id === tabletSlug);
    }

    getTablets(language) {
        return tablets[language];
    }

    getFilter() {
        return tabletFilter;
    }

    setFilter(filter) {
        tabletFilter = filter;
        notifyChange();
    }

    // Listeners

    addChangeListener(listener) {
        changeListeners.push(listener);
    }

    removeChangeListener(listener) {
        changeListeners = changeListeners.filter((element) => {
            return element !== listener;
        });
    }

}

export default new TabletStore();
