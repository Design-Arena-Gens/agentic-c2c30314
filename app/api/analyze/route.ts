import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const maxDuration = 60;

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Remove scripts, styles, and other non-content elements
    $('script, style, nav, footer, iframe, noscript').remove();

    // Extract text content
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1s = $('h1').map((_, el) => $(el).text()).get().join(' | ');
    const h2s = $('h2').map((_, el) => $(el).text()).get().join(' | ');
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);

    return `
Title: ${title}
Meta Description: ${metaDescription}
Main Headers (H1): ${h1s}
Sub Headers (H2): ${h2s}
Body Content: ${bodyText}
    `.trim();
  } catch (error) {
    throw new Error('Failed to scrape website. Please check the URL and try again.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, apiKey } = await request.json();

    if (!url || !apiKey) {
      return NextResponse.json(
        { error: 'URL and API key are required' },
        { status: 400 }
      );
    }

    // Scrape the website
    const websiteContent = await scrapeWebsite(url);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Create comprehensive marketing analysis prompt
    const prompt = `You are an expert marketing team consisting of brand strategists, content marketers, SEO specialists, social media managers, paid advertising experts, and email marketing specialists.

Analyze the following website content and provide a COMPLETE, COMPREHENSIVE marketing strategy that would replace an entire marketing department:

${websiteContent}

You must return a valid JSON object with the following exact structure (no markdown, no code blocks, just pure JSON):

{
  "overview": {
    "businessType": "string describing the business",
    "targetAudience": "detailed target audience description",
    "valueProposition": "clear value proposition",
    "competitiveAdvantages": ["advantage 1", "advantage 2", "advantage 3"]
  },
  "brandStrategy": {
    "positioning": "detailed brand positioning statement",
    "voiceTone": "description of brand voice and tone",
    "keyMessages": ["message 1", "message 2", "message 3"],
    "brandPersonality": ["trait 1", "trait 2", "trait 3", "trait 4"]
  },
  "contentStrategy": {
    "contentPillars": ["pillar 1", "pillar 2", "pillar 3", "pillar 4"],
    "contentTypes": ["type 1", "type 2", "type 3", "type 4", "type 5"],
    "postingFrequency": "recommended posting schedule",
    "contentCalendar": [
      {
        "week": "Week 1",
        "topics": ["topic 1", "topic 2", "topic 3"]
      },
      {
        "week": "Week 2",
        "topics": ["topic 1", "topic 2", "topic 3"]
      },
      {
        "week": "Week 3",
        "topics": ["topic 1", "topic 2", "topic 3"]
      },
      {
        "week": "Week 4",
        "topics": ["topic 1", "topic 2", "topic 3"]
      }
    ]
  },
  "seoStrategy": {
    "primaryKeywords": ["keyword 1", "keyword 2", "keyword 3"],
    "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
    "contentRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
    "technicalSEO": ["action 1", "action 2", "action 3"]
  },
  "socialMediaStrategy": {
    "platforms": [
      {
        "platform": "LinkedIn",
        "strategy": "detailed strategy",
        "contentIdeas": ["idea 1", "idea 2", "idea 3"],
        "postingSchedule": "schedule description"
      },
      {
        "platform": "Twitter/X",
        "strategy": "detailed strategy",
        "contentIdeas": ["idea 1", "idea 2", "idea 3"],
        "postingSchedule": "schedule description"
      },
      {
        "platform": "Instagram",
        "strategy": "detailed strategy",
        "contentIdeas": ["idea 1", "idea 2", "idea 3"],
        "postingSchedule": "schedule description"
      }
    ]
  },
  "paidAdvertising": {
    "recommendedChannels": ["channel 1", "channel 2", "channel 3"],
    "budgetAllocation": [
      {
        "channel": "channel name",
        "percentage": "XX%",
        "rationale": "why this allocation"
      }
    ],
    "campaignIdeas": [
      {
        "name": "campaign name",
        "objective": "campaign objective",
        "targeting": "target audience details",
        "creative": "creative concept"
      }
    ]
  },
  "emailMarketing": {
    "strategy": "overall email marketing approach",
    "segmentation": ["segment 1", "segment 2", "segment 3"],
    "campaignTypes": ["type 1", "type 2", "type 3"],
    "automationFlows": [
      {
        "name": "flow name",
        "trigger": "what triggers this flow",
        "emails": ["email 1 subject", "email 2 subject", "email 3 subject"]
      }
    ]
  },
  "metrics": {
    "kpis": [
      {
        "metric": "metric name",
        "target": "target value",
        "measurement": "how to measure"
      }
    ]
  },
  "actionPlan": {
    "immediate": ["action 1", "action 2", "action 3"],
    "shortTerm": ["action 1", "action 2", "action 3"],
    "longTerm": ["action 1", "action 2", "action 3"]
  }
}

Be specific, actionable, and comprehensive. This should be a complete marketing strategy that someone could immediately implement.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON:', responseText);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
