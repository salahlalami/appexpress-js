import delegate from "../lib/delegate";

function dataOption(current) {
  // console.log(this);

  const result = current
    .querySelector(".toggleOption")
    .classList.contains("show");

  const toggleOptions = document.querySelectorAll(".toggleOption.show");
  [].forEach.call(toggleOptions, function (toggleOption) {
    toggleOption.classList.remove("show");
  });
  if (result) {
    current.querySelector(".toggleOption").classList.remove("show");
  } else {
    current.querySelector(".toggleOption").classList.add("show");
  }
}
function moreOption() {
  delegate(
    document.body,
    ".moreOption",
    "click",
    function (e) {
      dataOption(e.delegateTarget);
    },
    false
  );

  document.addEventListener(
    "click",
    function (event) {
      if (event.target.closest(".moreOption")) {
        return;
      }

      const toggleOptions = document.querySelectorAll(".toggleOption.show");
      [].forEach.call(toggleOptions, function (toggleOption) {
        console.log("outside moreoption click");
        toggleOption.classList.remove("show");
      });
    },
    false
  );
}
export default moreOption;
