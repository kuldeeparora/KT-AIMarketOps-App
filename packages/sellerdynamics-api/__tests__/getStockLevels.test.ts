import { getAllStockLevels } from '../getStockLevels';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

jest.mock('axios');
jest.mock('xml2js');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedParseStringPromise = parseStringPromise as jest.Mock;

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

    const result = await getAllStockLevels({
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
    const result = await getAllStockLevels({
      encryptedLogin: 'enc',
      retailerId: 'ret',
      endpoint: 'http://test',
    });
    expect(result).toEqual([]);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
}); 