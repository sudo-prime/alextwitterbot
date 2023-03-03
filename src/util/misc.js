/* misc.js
    Miscellaneous utility methods. 
*/

module.exports.colors = {
    green: "#3fd968",
    yellow: "#e89d3a",
    red: "#d12a2a",
    gray: "#808080"
}

// [1, 2, 3] -> "1, 2, and 3"
// [1, 2] -> "1 and 2"
// [1] => "1"
module.exports.toOxfordComma = (array) => {
    if (array.length > 2) {
        return array.slice(0, array.length - 1)
            .concat(`and ${array.slice(-1).toString()}`)
            .join(', ')
    } else if (array.length === 2) {
        return `${array[0].toString()} and ${array[1].toString()}`;
    } else if (array.length === 1) {
        return array[0].toString();
    }
};


// Fisher-Yates shuffle algorithm
module.exports.shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
};

// TODO: cleanup
module.exports.nthString = (number) => {
    const whatNumberIsIt = number.toString();

    let ending;
    let letters;
    if (whatNumberIsIt.length >= 2) {
        ending = whatNumberIsIt[whatNumberIsIt.length - 2] + whatNumberIsIt[whatNumberIsIt.length - 1]
    } else {
        ending = '0' + whatNumberIsIt;
    }
    
    if (ending[0] === '1') {
        letters = 'th';
    } else {
        if (ending[1] === '1') {
            letters = 'st';
        } else if (ending[1] === '2') {
            letters = 'nd';
        } else if (ending[1] === '3') {
            letters = 'rd';
        } else {
            letters = 'th';
        }
    }

    return whatNumberIsIt + letters;
}
