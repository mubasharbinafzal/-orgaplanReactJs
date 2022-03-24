const error = console.error;
function logError(...parameters) {
  let filter = parameters.find((parameter) => {
    return (
      // Filter error because XXX
      parameter.includes("Warning: %s is deprecated in StrictMode")
      // Another error to filter because of YYYY
      // || parameter.includes("Warning:")
    );
  });
  if (!filter) error(...parameters);
}
console.error = logError;
