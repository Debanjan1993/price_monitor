"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const DIContainer_1 = __importDefault(require("./ioc/DIContainer"));
const connecToDB_1 = __importDefault(require("./connecToDB"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express_1.default();
        const port = process.env.PORT || 4000;
        app.use(body_parser_1.default.json());
        app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        yield connecToDB_1.default();
        app.use(express_session_1.default({
            secret: config_1.default.get("sessionKey"),
            resave: false,
            saveUninitialized: true
        }));
        // console.log(path.join(__dirname, '../public'));
        yield DIContainer_1.default.instance.init();
        const routes = DIContainer_1.default.container.get(routes_1.default);
        routes.init(app);
        app.listen(port, () => console.log(`App started on port ${port}`));
    });
})();
