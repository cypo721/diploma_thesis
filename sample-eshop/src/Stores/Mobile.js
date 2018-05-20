import Client from "../Client.js";
import CommerceClient from "../CommerceClient"
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let mobiles = initLanguageCodeObject();
let processings = [];
let productStatuses = [];
let comMobiles;

let notifyChange = () => {
    changeListeners.forEach((listener) => {
        listener();
    });
};

const request = {
    uri: '/kentico-cloud-integration-63/product-projections/search?filter=productType.id:"ec73aefd-a746-48e6-b967-880a49f2a634"',
    method: 'GET',
};

let fetchMobiles = (language) => {
    console.log("query " + language);
    var query = Client.items()
        .type('mobile_phone');

    if (language) {
      query.languageParameter(language);
    }
    //fetch('http://commercetoolsintegration.azurewebsites.net/api/auth',{ mode: 'no-cors' }).then(result => console.log(result));
    CommerceClient().execute(request)
        .then(result => {
            console.log(result);
            mobiles[language] = result;
            query.get()
                .subscribe(response => {
                    var res = [];
                    if (language) {
                        comMobiles = mobiles[language];
                        mobiles[language] = response.items;
                        console.log(response.items);
                        comMobiles.body.results.forEach(function(el){
                            var match = mobiles[language].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            if (match) {
                                el = Object.assign(match, el);
                                console.log(el);
                                res.push(el);
                            }
                        })
                        console.log(res);
                        mobiles[language] = res;
                        console.log(mobiles[language]);

                    } else {
                        comMobiles = mobiles[defaultLanguage];
                        mobiles[defaultLanguage] = response.items;
                        comMobiles.body.results.forEach(function(el){
                            var match = mobiles[defaultLanguage].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            el = Object.assign(match, el);
                            console.log(el);
                            res.push(el);
                        });
                        console.log(res);
                        mobiles[defaultLanguage] = res;
                        console.log(mobiles[defaultLanguage]);
                    }

                    notifyChange();
                });
        });

}

export class Filter {

    matches(mobile) {
        return true;
    }

}

let mobileFilter = new Filter();

class MobileStore {

    // Actions

    provideMobile(mobileSlug, language) {
        fetchMobiles(language);
    }

    provideMobiles(language) {
        fetchMobiles(language);
    }

    // Methods

    getMobile(mobileSlug, language) {
        ;
        return mobiles[language || defaultLanguage].find((mobile) => mobile.id === mobileSlug);
    }

    getMobiles(language) {
        return mobiles[language];
    }

    getProcessings() {
        return processings;
    }

    getProductStatuses() {
        return productStatuses;
    }

    getFilter() {
        return mobileFilter;
    }

    setFilter(filter) {
        mobileFilter = filter;
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

export default new MobileStore();
