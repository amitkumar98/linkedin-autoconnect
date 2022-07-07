(() => {
  let inProgress = false;
  let timerId = null;
  let processed = 0;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, interval, searchQuery } = request;

    if (type === "NEW") {
      chrome.storage.sync.get([searchQuery], (data) => {
        chrome.storage.sync.set({
          [searchQuery]: data[searchQuery] ? data[searchQuery] : 0,
        });
      });
    } else if (type === "START") {
      let buttons = document.getElementsByClassName(
        "artdeco-button artdeco-button--2 artdeco-button--secondary ember-view"
      );
      buttons = Array.from(buttons).filter((b) =>
        b.innerHTML.includes("Connect")
      );

      timerId = setInterval(() => {
        if (processed < buttons.length) {
          inProgress = true;
          buttons[processed].click();

          setTimeout(() => {
            let sendNow = document.getElementsByClassName(
              "artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1"
            )[0];
            // console.log("Send now button : ", sendNow);
            if (sendNow && sendNow.innerText === "Send") {
              console.log("Sending a conn request");
              sendNow.click();
            }
          }, 200);

          processed++;
        }

        if (processed === buttons.length) {
          inProgress = false;
        }
      }, interval);

      if (processed === buttons.length) {
        setTimeout(() => {
          clearInterval(timerId);
        }, interval);
      }
    } else if (type === "STOP") {
      inProgress = false;
      setTimeout(() => {
        clearInterval(timerId);
      }, 0);
    }
  });
})();
