/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: "es5",
  printWidth: 110,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
