// lib/gemini.ts
import { GoogleGenAI } from '@google/genai';
import type { GenerateContentConfig } from '@google/genai';
import { AgentConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export class GeminiAgent {
  private config: AgentConfig;
  private metrics: {
    tasks_completed: number;
    avg_completion_time: number;
    total_cost: number;
    success_rate: number;
  };

  constructor(config: AgentConfig) {
    this.config = config;
    this.metrics = {
      tasks_completed: 0,
      avg_completion_time: 0,
      total_cost: 0,
      success_rate: 100
    };
  }

  async executeTask(task: string): Promise<{
    result: string;
    duration: number;
    success: boolean;
    cost: number;
  }> {
    const startTime = Date.now();
    
    try {
      const prompt = `${this.config.system_prompt}\n\nTask: ${task}`;
      
      const response = await ai.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        } as GenerateContentConfig
      });
      
      const duration = (Date.now() - startTime) / 1000;
      const cost = this.calculateCost(response.text?.length || 0, duration);
      
      // Update metrics
      this.updateMetrics(duration, cost, true);
      
      return {
        result: response.text || '',
        duration,
        success: true,
        cost
      };
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      this.updateMetrics(duration, 0, false);
      
      return {
        result: `Error: ${error}`,
        duration,
        success: false,
        cost: 0
      };
    }
  }

  private calculateCost(outputLength: number, duration: number): number {
    // Rough cost estimation based on Gemini 2.0 pricing
    const baseRate = this.config.model.includes('thinking') ? 0.003 : 0.002;
    return (outputLength / 1000) * baseRate;
  }

  private updateMetrics(duration: number, cost: number, success: boolean) {
    const totalTasks = this.metrics.tasks_completed;
    this.metrics.avg_completion_time = 
      (this.metrics.avg_completion_time * totalTasks + duration) / (totalTasks + 1);
    this.metrics.tasks_completed++;
    this.metrics.total_cost += cost;
    
    // Update success rate
    const successfulTasks = Math.round((this.metrics.success_rate / 100) * totalTasks);
    this.metrics.success_rate = 
      ((successfulTasks + (success ? 1 : 0)) / this.metrics.tasks_completed) * 100;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getConfig() {
    return { ...this.config };
  }
}