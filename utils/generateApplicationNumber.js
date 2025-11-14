function generateApplicationNumber() {
  const prefix = "APP";
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  return `${prefix}${timestamp}${randomPart}`;
}

export default generateApplicationNumber;
