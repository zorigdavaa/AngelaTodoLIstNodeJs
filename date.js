exports.getDay = function () {
  const today = new Date();
  const options = { weekday: "long" };
  return today.toLocaleDateString("en-Us", options);
};
exports.getDate = function () {
    const today = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString("en-Us", options);
  };
