"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
exports.default = (0, config_1.defineConfig)({
    datasource: {
        provider: 'sqlite',
        url: process.env.DATABASE_URL || 'file:./dev.db',
    },
});
//# sourceMappingURL=config.js.map