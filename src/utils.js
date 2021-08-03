const getModelNamePlural = (modelName) => {
  if (modelName.toLowerCase() === "person") {
    return "people";
  } else {
    return `${modelName.toLowerCase()}s`;
  }
}

export { getModelNamePlural };