import _ from 'lodash'
/*
Initialize languages.
 */

export const languageCodes = [
    'en-US', // default languages
    'cs-CZ'
];

export const englishCode = languageCodes[0];
export const czechCode = languageCodes[1];

export const languageCodesLowerCase = languageCodes.map(code => code.toLowerCase());

export const dateFormats = {
    'en-US': {
        dayNames: [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ],
        monthNames: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ],
        timeNames: [
            'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
        ]
    },
    'cs-CZ': {
        dayNames: [
            'Ned', 'Pon', 'Ute', 'Stř', 'Čtv', 'Pát', 'Sob',
            'Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'
        ],
        monthNames: [
            'Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čer', 'Črc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro',
            'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
        ],
        timeNames: [
            'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
        ]
    }
}

export const defaultLanguage = languageCodes[0];

export const initLanguageCodeObject = (object) => {
    if (!object) {
        object = {};
    }

    languageCodes.forEach(language => {
        object[language] = [];
    })

    return object
}

export const getLanguageCode = (match) => {
    const languageCode = languageCodes[0];
    if (!_.has(match, ['params', 'lang'])) {
        return languageCode;
    }

    const languageParameter = _.get(match, ['params', 'lang']);
    if (languageCodesLowerCase.indexOf(languageParameter.toLowerCase()) > -1) {
        return languageCodes[languageCodesLowerCase.indexOf(languageParameter.toLowerCase())];
    }
    return defaultLanguage;
}

module.exports = {
    languageCodes,
    languageCodesLowerCase,
    dateFormats,
    defaultLanguage,
    initLanguageCodeObject,
    getLanguageCode,
    englishCode,
    czechCode
};
export default languageCodes;