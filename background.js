let currentTabId;
let contactsTabId;
let previousTab;

function onError(e) {
  console.log("***Error: " + e);
};

function createPinnedTab() {
  browser.tabs.create(
    {
      url: "https://contacts.google.com",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(contactsTabs) {
  //console.log("currentTabId: " + currentTabId);
  if(contactsTabs.length > 0) {
    //console.log("there is a calendar tab");
    contactsTabId = contactsTabs[0].id;
    if(contactsTabId === currentTabId) {
      //console.log("I'm in the contacts tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the contacts tab");
      previousTab = currentTabId;
      browser.tabs.update(contactsTabId, {active: true,});
    }
  } else {
    //console.log("there is NO contacts tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  //console.log("*********Button clicked*********");
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://contacts.google.com/*"});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);