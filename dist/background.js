'use strict';

/* global chrome */

function executeExtraction() {
  chrome.tabs.executeScript({
    code: 'window.extractContent()'
  });
}

chrome.browserAction.onClicked.addListener(executeExtraction);