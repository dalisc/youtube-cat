console.log("popup");

saveOptions = () => {
  const elements = document.getElementsByClassName("enableKey");
  let checkedItems = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      checkedItems.push(elements[i].value);
    }
  }

  localStorage.setItem("blockedCategories", JSON.stringify(checkedItems));
  console.log(elements);
  console.log(checkedItems);
  console.log(localStorage["blockedCategories"]);
};

function restoreOptions() {
  const blockedCategories = JSON.parse(
    localStorage.getItem("blockedCategories")
  );
  console.log(blockedCategories);
  if (undefined !== blockedCategories) {
    const elements = document.getElementsByClassName("enableKey");
    console.log(blockedCategories[0]);
    for (let i = 0; i < blockedCategories.length; i++) {
      elements[blockedCategories[i]].checked = true;
    }
    console.log("Restoring success!");
  }
}

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
});
