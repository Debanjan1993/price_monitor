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
const express_1 = require("express");
const inversify_1 = require("inversify");
const Usercontroller_1 = __importDefault(require("../controllers/Usercontroller"));
const crypt_1 = __importDefault(require("../crypto/crypt"));
const UserRepository_1 = __importDefault(require("../repository/UserRepository"));
const routes_1 = __importDefault(require("../routes/routes"));
class DIContainer {
    constructor() {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            if (!DIContainer._container) {
                const container = new inversify_1.Container();
                container.bind(routes_1.default).toSelf();
                container.bind(UserRepository_1.default).toSelf();
                container.bind(crypt_1.default).toSelf();
                container.bind(Usercontroller_1.default).toSelf();
                const router = express_1.Router();
                container.bind(express_1.Router).toConstantValue(router);
                DIContainer._container = container;
            }
        });
    }
    static get instance() {
        if (!DIContainer._instance) {
            DIContainer._instance = new DIContainer();
        }
        return DIContainer._instance;
    }
    static get container() {
        return DIContainer._container;
    }
}
exports.default = DIContainer;
