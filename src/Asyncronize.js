export const asynchronize = async (liveThing, immediately = false) => {
    if (immediately && ((liveThing.models && liveThing.models.length) || liveThing.model))
    
    return liveThing.models || liveThing.model;

    return new Promise((resolve, reject) => {
        // we wrap the resolve in setTimeout(0) to allow 'hasMore' to refresh for live collection (reactive related bug.)
        liveThing.once("dataUpdated", (data) =>
          setTimeout(() => {
            resolve(data);
          }, 0)
        )})
}


// .on("loadingStatusChanged", ({ newValue }) => {
//   if (newValue === "loaded") {
//     // put the set timeout + resolve
//   } else if (newValue === "error")
//     // reject   
// })

// return new Promise((resolve, reject) => {
//   // we wrap the resolve in setTimeout(0) to allow 'hasMore' to refresh for live collection (reactive related bug.)
//   liveThing.once("dataUpdated", (data) =>
//     setTimeout(() => {
//       resolve(data);
//     }, 0)
//   )})