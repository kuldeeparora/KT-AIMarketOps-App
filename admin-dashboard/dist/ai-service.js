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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
var openai_1 = require("@langchain/openai");
var groq_sdk_1 = __importDefault(require("groq-sdk"));
// AI Service that uses your available API keys
var AIService = /** @class */ (function () {
    function AIService() {
        this.openaiClient = null;
        this.groqClient = null;
        // Initialize OpenAI client if key is available
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-key') {
            this.openaiClient = new openai_1.ChatOpenAI({
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4o-mini', // Cost-effective model
                temperature: 0.7,
            });
            console.log('✅ OpenAI client initialized');
        }
        // Initialize Groq client if key is available
        if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-key') {
            this.groqClient = new groq_sdk_1.default({
                apiKey: process.env.GROQ_API_KEY,
            });
            console.log('✅ Groq client initialized');
        }
        if (!this.openaiClient && !this.groqClient) {
            console.warn('⚠️ No AI providers available. Please check your API keys.');
        }
    }
    // Check which AI services are available
    AIService.prototype.getAvailableProviders = function () {
        var providers = [];
        if (this.groqClient)
            providers.push('Groq');
        if (this.openaiClient)
            providers.push('OpenAI');
        return providers;
    };
    // Simple chat completion with Groq (faster, preferred)
    AIService.prototype.chatWithGroq = function (message, systemPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, response, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.groqClient) {
                            throw new Error('Groq client not available');
                        }
                        messages = [];
                        if (systemPrompt) {
                            messages.push({ role: 'system', content: systemPrompt });
                        }
                        messages.push({ role: 'user', content: message });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.groqClient.chat.completions.create({
                                messages: messages,
                                model: 'llama-3.1-70b-versatile',
                                temperature: 0.7,
                                max_tokens: 1000,
                            })];
                    case 2:
                        response = _c.sent();
                        return [2 /*return*/, ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || ''];
                    case 3:
                        error_1 = _c.sent();
                        console.error('Groq Chat Error:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Simple chat completion with OpenAI (fallback)
    AIService.prototype.chatWithOpenAI = function (message, systemPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.openaiClient) {
                            throw new Error('OpenAI client not available');
                        }
                        messages = [];
                        if (systemPrompt) {
                            messages.push({ role: 'system', content: systemPrompt });
                        }
                        messages.push({ role: 'user', content: message });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.openaiClient.invoke(messages)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.content];
                    case 3:
                        error_2 = _a.sent();
                        console.error('OpenAI Chat Error:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Smart chat that uses best available provider
    AIService.prototype.chat = function (message, systemPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.groqClient) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.chatWithGroq(message, systemPrompt)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.warn('Groq failed, falling back to OpenAI:', error_3);
                        return [3 /*break*/, 4];
                    case 4:
                        if (!this.openaiClient) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.chatWithOpenAI(message, systemPrompt)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: throw new Error('No AI provider available');
                }
            });
        });
    };
    // Kent Traders specific AI assistant
    AIService.prototype.getBusinessInsight = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var systemPrompt;
            return __generator(this, function (_a) {
                systemPrompt = "You are an AI assistant for Kent Traders, a UK-based trading company. \n    You help with inventory management, market analysis, and business operations. \n    Provide helpful, professional responses focused on business efficiency and growth.\n    Keep responses concise and actionable.";
                return [2 /*return*/, this.chat(query, systemPrompt)];
            });
        });
    };
    // Test connectivity
    AIService.prototype.testConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var providers, results, _i, providers_1, provider, response, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providers = this.getAvailableProviders();
                        results = { providers: providers };
                        _i = 0, providers_1 = providers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < providers_1.length)) return [3 /*break*/, 9];
                        provider = providers_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!(provider === 'Groq')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.chatWithGroq('Hello, are you working?')];
                    case 3:
                        response = _a.sent();
                        results.groq = { status: 'success', response: response.substring(0, 50) + '...' };
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(provider === 'OpenAI')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.chatWithOpenAI('Hello, are you working?')];
                    case 5:
                        response = _a.sent();
                        results.openai = { status: 'success', response: String(response).substring(0, 50) + '...' };
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        results[provider.toLowerCase()] = { status: 'error', error: String(error_4) };
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, results];
                }
            });
        });
    };
    return AIService;
}());
exports.aiService = new AIService();
exports.default = AIService;
