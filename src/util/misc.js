module.exports.colors = {
    green: "#3fd968",
    yellow: "#e89d3a",
    red: "#d12a2a",
    gray: "#808080"
}

module.exports.toOxfordComma = (array) => {
    if (array.length > 2) {
        return array.slice(0, array.length - 1)
            .concat(`and ${array.slice(-1)}`)
            .join(', ')
    } else if (array.length === 2) {
        return `${array[0]} and ${array[1]}`;
    } else if (array.length === 1) {
        return array[0];
    }
}


// Fisher-Yates shuffle algorithm.
module.exports.shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

module.exports.format = (text, ...args) => {
    return text.replace(/{(\d+)}/g, (match, number) => { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};