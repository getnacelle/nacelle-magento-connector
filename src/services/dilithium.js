export const buildMigration = (mutationName, inputType, params) => {
  return `mutation ${mutationName}($input: ${inputType}!) {
    ${mutationName}(input: $input) {
      count
      ids
    }
  }`;
};
