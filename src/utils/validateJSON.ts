export const validateJSON = (json: string) => {
  try {
    const data = JSON.parse(json);
    return data;
  } catch {
    throw new Error("Invalid JSON");
  }
};
