// packages/ai-insights/src/models/predictive-analytics.ts
import * as tf from '@tensorflow/tfjs-node';
import { z } from "zod";

const PredictionSchema = z.object({
  productId: z.string(),
  predictions: z.object({
    demand: z.array(z.number()),
    price: z.array(z.number()),
    stockout_risk: z.number()
  }),
  confidence: z.number(),
  factors: z.array(z.object({
    name: z.string(),
    impact: z.number()
  }))
});

export class PredictiveAnalytics {
  private models: Map<string, tf.LayersModel>;
  private isInitialized: boolean = false;

  constructor() {
    this.models = new Map();
  }

  async initialize() {
    // In production, load pre-trained models
    // For now, create simple models for demonstration
    this.models.set('demand', await this.createDemandModel());
    this.models.set('price', await this.createPriceModel());
    this.isInitialized = true;
  }

  private async createDemandModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 7 }) // Predict next 7 days
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mse']
    });

    return model;
  }

  private async createPriceModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1 }) // Predict optimal price
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });

    return model;
  }

  async predictDemand(
    productId: string,
    historicalData: number[],
    externalFactors?: any
  ): Promise<z.infer<typeof PredictionSchema>> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const model = this.models.get('demand')!;
    
    // Prepare features (simplified for demo)
    const features = this.prepareFeatures(historicalData, externalFactors);
    const input = tf.tensor2d([features]);
    
    // Run prediction
    const prediction = model.predict(input) as tf.Tensor;
    const demandPredictions = await prediction.array() as number[][];
    
    // Calculate confidence and contributing factors
    const confidence = this.calculateConfidence(demandPredictions[0]);
    const factors = this.analyzeFactors(features, demandPredictions[0]);

    // Predict optimal price
    const pricePrediction = await this.predictOptimalPrice(productId, demandPredictions[0]);
    
    // Calculate stockout risk
    const stockoutRisk = await this.calculateStockoutRisk(productId, demandPredictions[0]);

    // Clean up tensors
    input.dispose();
    prediction.dispose();

    return PredictionSchema.parse({
      productId,
      predictions: {
        demand: demandPredictions[0],
        price: pricePrediction,
        stockout_risk: stockoutRisk
      },
      confidence,
      factors
    });
  }

  private prepareFeatures(historicalData: number[], externalFactors?: any): number[] {
    // Simple feature engineering
    const features = [
      ...historicalData.slice(-7), // Last 7 days
      historicalData.reduce((a, b) => a + b, 0) / historicalData.length, // Average
      Math.max(...historicalData), // Max
      Math.min(...historicalData), // Min
    ];

    // Pad or truncate to expected size
    while (features.length < 10) {
      features.push(0);
    }

    return features.slice(0, 10);
  }

  private calculateConfidence(predictions: number[]): number {
    // Simple confidence calculation based on prediction variance
    const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length;
    const variance = predictions.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / predictions.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to confidence score (0-1)
    const confidence = Math.max(0, 1 - (stdDev / mean));
    return Math.round(confidence * 100) / 100;
  }

  private analyzeFactors(features: number[], predictions: number[]): Array<{name: string, impact: number}> {
    // Simplified factor analysis
    return [
      { name: 'Historical Trend', impact: 0.35 },
      { name: 'Seasonality', impact: 0.25 },
      { name: 'Recent Sales', impact: 0.20 },
      { name: 'Market Conditions', impact: 0.15 },
      { name: 'External Events', impact: 0.05 }
    ];
  }

  private async predictOptimalPrice(productId: string, demandPredictions: number[]): Promise<number[]> {
    const model = this.models.get('price')!;
    
    // Prepare price features
    const features = [
      ...demandPredictions.slice(0, 5),
      Math.max(...demandPredictions),
      Math.min(...demandPredictions),
      demandPredictions.reduce((a, b) => a + b, 0) / demandPredictions.length
    ];

    const input = tf.tensor2d([features]);
    const prediction = model.predict(input) as tf.Tensor;
    const pricePredictions = await prediction.array() as number[][];
    
    input.dispose();
    prediction.dispose();

    // Return price predictions for each day
    return demandPredictions.map(() => Math.round(pricePredictions[0][0] * 100) / 100);
  }

  private async calculateStockoutRisk(productId: string, demandPredictions: number[]): Promise<number> {
    // Simple stockout risk calculation
    const totalDemand = demandPredictions.reduce((a, b) => a + b, 0);
    const avgDemand = totalDemand / demandPredictions.length;
    const maxDemand = Math.max(...demandPredictions);
    
    // Risk based on demand volatility
    const risk = (maxDemand - avgDemand) / avgDemand;
    return Math.min(1, Math.max(0, risk));
  }

  async trainModel(modelType: 'demand' | 'price', trainingData: any[]) {
    const model = this.models.get(modelType);
    if (!model) throw new Error(`Model ${modelType} not found`);

    // Prepare training data
    const xs = tf.tensor2d(trainingData.map(d => d.features));
    const ys = tf.tensor2d(trainingData.map(d => d.labels));

    // Train model
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });

    // Clean up
    xs.dispose();
    ys.dispose();
  }
}