saveOptions = () => {
  const elements = document.getElementsByClassName("enableKey");
  let checkedItems = [];
  const catArray = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      checkedItems.push(elements[i].value);
      catArray.push(elements[i].name);
    }
  }

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "changePreferences",
        categories: catArray
      });
    }
  );

  localStorage.setItem("blockedCategories", JSON.stringify(checkedItems));
};

function restoreOptions() {
  const blockedCategories = JSON.parse(
    localStorage.getItem("blockedCategories")
  );

  if (null !== blockedCategories) {
    const elements = document.getElementsByClassName("enableKey");
    const catArray = [];
    console.log("blocked cats: ", blockedCategories);

    for (let i = 0; i < blockedCategories.length; i++) {
      console.log("element:", blockedCategories[i]);
      elements[blockedCategories[i]].checked = true;
    }
  }
}

selectAll = () => {
  const elements = document.getElementsByClassName("enableKey");
  for (let i = 0; i < elements.length; i++) {
    elements[i].checked = true;
  }
};

unSelectAll = () => {
  const elements = document.getElementsByClassName("enableKey");
  for (let i = 0; i < elements.length; i++) {
    elements[i].checked = false;
  }
};

toBool = str => {
  if ("false" === str) return false;
  return str;
};

document.addEventListener("DOMContentLoaded", function() {
  document
    .getElementById("popupBody")
    .addEventListener("load", restoreOptions());
  document
    .getElementById("savePreferences")
    .addEventListener("click", saveOptions);
  document.getElementById("selectAll").addEventListener("change", function() {
    if (this.checked) {
      selectAll();
    } else {
      unSelectAll();
    }
  });
});
