if(!localStorage['theme'] || localStorage['theme'] == '') localStorage['theme'] = 'sunburst';
if(!localStorage['font'] || localStorage['font'] == '') localStorage['font'] = 'Inconsolata';

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    
    if (request.key && request.key != '') {
        chrome.tabs.getSelected(null, function(stab) {
            if (localStorage[stab.id] && localStorage[stab.id] != '') {
                var tab_data = JSON.parse(localStorage[stab.id]);
                var value = tab_data[request.key] || localStorage[request.key];
            }
            else {
                var value = localStorage[request.key];
            }
            sendResponse({value: value});
        });
    }

    if (request.op == 'highlight')
    {
        chrome.tabs.getSelected(null, function(stab) {
            stab = sender.tab || stab;
            if (localStorage[stab.id] && localStorage[stab.id] != '')
                var tab_data = JSON.parse(localStorage[stab.id]);
            else
                var tab_data = {language: ''}

            chrome.pageAction.show(stab.id);

            chrome.tabs.executeScript(stab.id, {file: 'js/reset-styles.js'}, function() {
                chrome.tabs.insertCSS(stab.id, {file: 'css/' + localStorage['theme'] + '.css'}, function() {
                    chrome.tabs.insertCSS(stab.id, {file: 'css/main.css'}, function() {
                        chrome.tabs.insertCSS(stab.id, {file: 'css/reset.css'}, function() {
                            localStorage[stab.id] = JSON.stringify({language: request.language});
                            chrome.tabs.executeScript(stab.id, {file: 'js/highlight.js'}, function() {
                                chrome.tabs.executeScript(stab.id, {file: 'js/languages/' + request.language + '.js'}, function() {
                                    chrome.tabs.executeScript(stab.id, {
                                        code: _.sprintf("document.body.style.fontFamily = '%s'; var blk = document.querySelector('pre'); var content = hljs.escape(blk.innerText); blk.innerHTML = '<code class=\"%s\">' + content + '</code>'; hljs.highlightBlock(blk.firstChild, '    ', false); document.body.style.display = 'block';", localStorage['font'], request.language.replace(/\W.*/, ''))
                                    }, function() {
                                        chrome.tabs.executeScript(stab.id, {file: 'js/line-numbers.js'});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    localStorage.removeItem(tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status != 'complete') return;
    chrome.tabs.executeScript(tabId, {file: 'js/inject.js'});
});
