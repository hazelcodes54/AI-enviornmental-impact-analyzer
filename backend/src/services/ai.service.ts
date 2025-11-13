import OpenAI from 'openai';
import { IProduct } from '../models/Product';
import { IEnvironmentalScore } from '../models/Analysis';

interface AnalysisResult {
  score: IEnvironmentalScore;
  insights: string[];
  recommendations: string[];
  rawAnalysis: string;
}

let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI | null => {
  if (openai) return openai;
  
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai;
  }
  
  return null;
};

export const analyzeEnvironmentalImpact = async (product: IProduct): Promise<AnalysisResult> => {
  try {
    const client = getOpenAIClient();
    
    // If OpenAI is not configured, use fallback
    if (!client) {
      console.log('OpenAI API key not configured, using fallback analysis');
      return getFallbackAnalysis(product);
    }

    // Create a detailed prompt for the AI
    const prompt = `Analyze the environmental impact of the following product and provide a comprehensive assessment:

Product Name: ${product.name}
Category: ${product.category}
Description: ${product.description}
${product.manufacturer ? `Manufacturer: ${product.manufacturer}` : ''}
${product.manufacturingLocation ? `Manufacturing Location: ${product.manufacturingLocation}` : ''}
${product.materials?.length ? `Materials: ${product.materials.join(', ')}` : ''}
${product.supplyChainInfo ? `Supply Chain Info: ${product.supplyChainInfo}` : ''}

Please provide:
1. Environmental scores (0-100, where 100 is most eco-friendly):
   - Carbon Footprint
   - Water Usage
   - Energy Consumption
   - Recyclability
   - Sustainability
   - Overall Score

2. Key insights about the environmental impact (3-5 points)

3. Recommendations for improvement or more sustainable alternatives (3-5 points)

Format your response as JSON with the following structure:
{
  "scores": {
    "carbonFootprint": number,
    "waterUsage": number,
    "energyConsumption": number,
    "recyclability": number,
    "sustainability": number,
    "overall": number
  },
  "insights": ["insight1", "insight2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an environmental impact assessment expert. Analyze products and provide detailed environmental scores and recommendations based on manufacturing, materials, supply chain, and sustainability factors."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const rawAnalysis = completion.choices[0].message.content || '';
    
    // Parse the AI response
    const aiResponse = JSON.parse(rawAnalysis);

    return {
      score: {
        overall: aiResponse.scores.overall,
        carbonFootprint: aiResponse.scores.carbonFootprint,
        waterUsage: aiResponse.scores.waterUsage,
        energyConsumption: aiResponse.scores.energyConsumption,
        recyclability: aiResponse.scores.recyclability,
        sustainability: aiResponse.scores.sustainability
      },
      insights: aiResponse.insights,
      recommendations: aiResponse.recommendations,
      rawAnalysis
    };
  } catch (error: any) {
    console.error('AI analysis error:', error);
    
    // Fallback to basic analysis if AI fails
    return getFallbackAnalysis(product);
  }
};

// Fallback analysis when AI is unavailable
const getFallbackAnalysis = (product: IProduct): AnalysisResult => {
  const baseScore = 50;
  
  // Simple heuristic-based scoring
  let carbonScore = baseScore;
  let waterScore = baseScore;
  let energyScore = baseScore;
  let recyclabilityScore = baseScore;
  let sustainabilityScore = baseScore;

  // Adjust based on category
  const categoryImpact: Record<string, any> = {
    electronics: { carbon: -15, water: -10, energy: -20, recyclability: -10 },
    clothing: { carbon: -10, water: -20, energy: -5, recyclability: 5 },
    food: { carbon: -5, water: -15, energy: 0, recyclability: 10 },
    furniture: { carbon: -10, water: -5, energy: -10, recyclability: -5 },
    transportation: { carbon: -25, water: -10, energy: -25, recyclability: -15 },
    other: { carbon: 0, water: 0, energy: 0, recyclability: 0 }
  };

  const impact = categoryImpact[product.category] || categoryImpact.other;
  carbonScore += impact.carbon;
  waterScore += impact.water;
  energyScore += impact.energy;
  recyclabilityScore += impact.recyclability;

  // Adjust based on materials
  if (product.materials?.some(m => m.toLowerCase().includes('recycled'))) {
    recyclabilityScore += 15;
    sustainabilityScore += 10;
  }

  if (product.materials?.some(m => m.toLowerCase().includes('plastic'))) {
    recyclabilityScore -= 10;
    carbonScore -= 5;
  }

  const overallScore = Math.round(
    (carbonScore + waterScore + energyScore + recyclabilityScore + sustainabilityScore) / 5
  );

  return {
    score: {
      overall: Math.max(0, Math.min(100, overallScore)),
      carbonFootprint: Math.max(0, Math.min(100, carbonScore)),
      waterUsage: Math.max(0, Math.min(100, waterScore)),
      energyConsumption: Math.max(0, Math.min(100, energyScore)),
      recyclability: Math.max(0, Math.min(100, recyclabilityScore)),
      sustainability: Math.max(0, Math.min(100, sustainabilityScore))
    },
    insights: [
      `This ${product.category} product has an estimated environmental impact score of ${overallScore}/100.`,
      'Analysis based on product category and available information.',
      'For more accurate results, please provide additional details about materials and manufacturing.'
    ],
    recommendations: [
      'Consider products with recycled materials',
      'Look for energy-efficient alternatives',
      'Check for certifications like Energy Star or Fair Trade',
      'Research the manufacturer\'s sustainability practices'
    ],
    rawAnalysis: JSON.stringify({
      note: 'Fallback analysis - AI service unavailable',
      scores: {
        overall: overallScore,
        carbonFootprint: carbonScore,
        waterUsage: waterScore,
        energyConsumption: energyScore,
        recyclability: recyclabilityScore,
        sustainability: sustainabilityScore
      }
    })
  };
};
