"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getStockLevels_1 = require("../getStockLevels");
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
jest.mock('axios');
jest.mock('xml2js');
const mockedAxios = axios_1.default;
const mockedParseStringPromise = xml2js_1.parseStringPromise;
describe('getAllStockLevels', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('fetches all pages and returns stock levels', async () => {
        mockedAxios.post.mockResolvedValue({ data: '<xml/>' });
        mockedParseStringPromise
            .mockResolvedValueOnce({
            'soap:Envelope': {
                'soap:Body': {
                    GetStockLevelsResponse: {
                        GetStockLevelsResult: {
                            IsError: 'false',
                            More: 'true',
                            StockLevels: { StockLevel: [{ SKU: 'A', Quantity: '10' }] },
                        },
                    },
                },
            },
        })
            .mockResolvedValueOnce({
            'soap:Envelope': {
                'soap:Body': {
                    GetStockLevelsResponse: {
                        GetStockLevelsResult: {
                            IsError: 'false',
                            More: 'false',
                            StockLevels: { StockLevel: [{ SKU: 'B', Quantity: '5' }] },
                        },
                    },
                },
            },
        });
        const result = await (0, getStockLevels_1.getAllStockLevels)({
            encryptedLogin: 'enc',
            retailerId: 'ret',
            endpoint: 'http://test',
        });
        expect(result).toEqual([
            { SKU: 'A', Quantity: 10 },
            { SKU: 'B', Quantity: 5 },
        ]);
        expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
    it('stops on error', async () => {
        mockedAxios.post.mockResolvedValue({ data: '<xml/>' });
        mockedParseStringPromise.mockResolvedValue({
            'soap:Envelope': {
                'soap:Body': {
                    GetStockLevelsResponse: {
                        GetStockLevelsResult: {
                            IsError: 'true',
                            More: 'false',
                            StockLevels: { StockLevel: [] },
                        },
                    },
                },
            },
        });
        const result = await (0, getStockLevels_1.getAllStockLevels)({
            encryptedLogin: 'enc',
            retailerId: 'ret',
            endpoint: 'http://test',
        });
        expect(result).toEqual([]);
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
});
