(function (namespace) {
  if ("replaceState" in history) {
    namespace.replaceHash = function (newhash: string) {
      if (("" + newhash).charAt(0) !== "#") newhash = "#" + newhash;
      history.replaceState("", "", newhash);
    };
  } else {
    const { hash } = location;
    namespace.replaceHash = function (newhash: string) {
      if (location.hash !== hash) history.back();
      location.hash = newhash;
    };
  }
})(window);

export {};
