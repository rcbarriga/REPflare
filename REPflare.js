// ----------------------------------------------------------------------------------
// REPflare - v1.0.0-fork
// ref.: https://github.com/Darkseal/REPflare
// A lightweight Cloudflare Worker to replace text in any web page
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// CONFIGURATION SETTINGS
// ----------------------------------------------------------------------------------

// set this to TRUE to use RegEx, FALSE otherwise
const textReplacement_useRegex = true;

// set this to TRUE to perform the replacement in a case-insensitive way, FALSE otherwise
const textReplacement_caseInsensitive = false;

// Text replacement configuration ( 'sourceText' : 'replacementText' )
const textReplacementRules = {
    'Apple': 'Banana',
    'https://www.myurl.com/': 'https://www.google.com/'
}


// ----------------------------------------------------------------------------------
// MAIN CODE
// ----------------------------------------------------------------------------------

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
    const response = await fetch(request);
    var html = await response.text();

    html = replaceText(html);

    // return modified response
    return new Response(html, {
        headers: response.headers
    })
}

function replaceText(html) {
    if (!textReplacementRules || textReplacementRules.length === 0) {
        return html;
    }

    var regexModifiers = 'g';
    if (textReplacement_caseInsensitive) {
        regexModifiers += 'i';
    }

    for (let k in textReplacementRules) {
        var v = textReplacementRules[k];

        if (textReplacement_useRegex) {
            html = html.replace(new RegExp(k, regexModifiers), v);
        }
        else {
            html = html.split(new RegExp(k, regexModifiers)).join(v);
        }
    }

    return html;
}
