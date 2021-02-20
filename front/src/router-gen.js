const fs = require('fs');
const {generateRoutes} = require('vue-route-generator');

const code = generateRoutes({
    pages: './pages'
});

const writeCode = code.toString().replace(/@/g, "..")

fs.writeFileSync('./routes/routes.js', writeCode)