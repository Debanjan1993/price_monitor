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
const express_1 = require("express");
const inversify_1 = require("inversify");
const Usercontroller_1 = __importDefault(require("../controllers/Usercontroller"));
const DIContainer_1 = __importDefault(require("../ioc/DIContainer"));
const path_1 = __importDefault(require("path"));
let Routes = class Routes {
    constructor() {
        this.init = (app) => {
            this.router.get('/login', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../../public/login.html'));
            });
            this.router.get('/signUp', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../../public/register.html'));
            });
            this.router.get('/dashboard', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../../public/dashboard.html'));
            });
            this.router.get('/test', (req, res) => {
                res.status(200).json('Test Successsful');
            });
            this.router.post('/api/signup', (req, res) => __awaiter(this, void 0, void 0, function* () {
                yield this.userController.addUser(req, res);
            }));
            app.use('/', this.router);
        };
        this.router = DIContainer_1.default.container.get(express_1.Router);
        this.userController = DIContainer_1.default.container.get(Usercontroller_1.default);
    }
};
Routes = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], Routes);
exports.default = Routes;
