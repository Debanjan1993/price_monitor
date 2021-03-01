"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const UserRepository_1 = __importDefault(require("../repository/UserRepository"));
const DIContainer_1 = __importDefault(require("../ioc/DIContainer"));
const inversify_1 = require("inversify");
const crypt_1 = __importDefault(require("../crypto/crypt"));
let UserController = class UserController {
    constructor() {
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { personName, email, password, password2 } = req.body;
            if (!personName) {
                return res.status(400).json('Please enter the name');
            }
            if (!email) {
                return res.status(400).json('Please enter the email');
            }
            if (!password) {
                return res.status(400).json('Please enter the password');
            }
            if (!password2) {
                return res.status(400).json('Please confirm the password by entering again');
            }
            if (password !== password2) {
                return res.status(400).json('The password entered do not match with each other');
            }
            const user = yield this.userRepository.getUserByEmail(email);
            if (user) {
                return res.status(400).json('User with this email already exists');
            }
            const hashedPassword = yield this.crypt.createCrypt(password);
            Object.assign(req.body, {
                password: hashedPassword
            });
            yield this.userRepository.saveUserToDB(req.body);
            res.status(201).json('User Successfully Created');
        });
        this.verifyUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            if (!username) {
                return res.status(400).json('Please enter the username');
            }
            if (!password) {
                return res.status(400).json('Please enter the password');
            }
            const user = yield this.userRepository.getUserByEmail(username);
            if (!user) {
                return res.status(400).json('No user exists with the entered email please sign up now');
            }
            const dbPassword = user.password;
            const isMatched = yield this.crypt.comparePassword(password, dbPassword);
            if (!isMatched) {
                return res.status(401).json('The password entered is not correct');
            }
            req.session.email = username;
            return res.status(200).json('Signed In');
        });
        this.userRepository = DIContainer_1.default.container.get(UserRepository_1.default);
        this.crypt = DIContainer_1.default.container.get(crypt_1.default);
    }
};
UserController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], UserController);
exports.default = UserController;
