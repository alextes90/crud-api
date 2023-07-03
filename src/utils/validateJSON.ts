export const validateJSON = (json: string) => {
  try {
    const data = JSON.parse(json);
    return data;
  } catch (err) {
    console.log(err);
    throw new Error('Invalid JSON');
  }
};
