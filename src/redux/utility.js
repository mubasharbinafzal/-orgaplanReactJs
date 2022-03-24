const updateObject = (oldObject, updatedObect) => {
  return {
    ...oldObject,
    ...updatedObect,
  };
};

const exportsObj = {
  updateObject,
};

export default exportsObj;
