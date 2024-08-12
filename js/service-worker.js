chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchApi") {
    fetch(request.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${request.apiKey}`,
      },
      body: JSON.stringify({ message: request.message }),
    })
      .then((response) => response.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously.
  }
});

// chrome.contextMenus.onClicked.addListener(genericOnClick);

// // Allows users to open the side panel by clicking on the action toolbar icon
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));

// // A generic onclick callback function.
// function genericOnClick(info) {
//   switch (info.menuItemId) {
//     case "radio":
//       // Radio item function
//       console.log("Radio item clicked. Status:", info.checked);
//       break;
//     case "checkbox":
//       // Checkbox item function
//       console.log("Checkbox item clicked. Status:", info.checked);
//       break;
//     default:
//       // Standard context menu item function
//       console.log("Standard context menu item clicked.");
//   }
// }
// chrome.runtime.onInstalled.addListener(function () {
//   // Create one test item for each context type.
//   let contexts = [
//     "page",
//     "selection",
//     "link",
//     "editable",
//     "image",
//     "video",
//     "audio",
//   ];
//   for (let i = 0; i < contexts.length; i++) {
//     let context = contexts[i];
//     let title = "Test '" + context + "' menu item";
//     chrome.contextMenus.create({
//       title: title,
//       contexts: [context],
//       id: context,
//     });
//   }

//   // Create a parent item and two children.
//   let parent = chrome.contextMenus.create({
//     title: "Test parent item",
//     id: "parent",
//   });
//   chrome.contextMenus.create({
//     title: "Child 1",
//     parentId: parent,
//     id: "child1",
//   });
//   chrome.contextMenus.create({
//     title: "Child 2",
//     parentId: parent,
//     id: "child2",
//   });

//   // Create a radio item.
//   chrome.contextMenus.create({
//     title: "radio",
//     type: "radio",
//     id: "radio",
//   });

//   // Create a checkbox item.
//   chrome.contextMenus.create({
//     title: "checkbox",
//     type: "checkbox",
//     id: "checkbox",
//   });

//   // Intentionally create an invalid item, to show off error checking in the
//   // create callback.
//   chrome.contextMenus.create(
//     { title: "Oops", parentId: 999, id: "errorItem" },
//     function () {
//       if (chrome.runtime.lastError) {
//         console.log("Got expected error: " + chrome.runtime.lastError.message);
//       }
//     }
//   );
// });
