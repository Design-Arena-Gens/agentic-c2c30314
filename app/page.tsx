'use client';

import { useState } from 'react';

interface MarketingAnalysis {
  overview: {
    businessType: string;
    targetAudience: string;
    valueProposition: string;
    competitiveAdvantages: string[];
  };
  brandStrategy: {
    positioning: string;
    voiceTone: string;
    keyMessages: string[];
    brandPersonality: string[];
  };
  contentStrategy: {
    contentPillars: string[];
    contentTypes: string[];
    postingFrequency: string;
    contentCalendar: Array<{
      week: string;
      topics: string[];
    }>;
  };
  seoStrategy: {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    contentRecommendations: string[];
    technicalSEO: string[];
  };
  socialMediaStrategy: {
    platforms: Array<{
      platform: string;
      strategy: string;
      contentIdeas: string[];
      postingSchedule: string;
    }>;
  };
  paidAdvertising: {
    recommendedChannels: string[];
    budgetAllocation: Array<{
      channel: string;
      percentage: string;
      rationale: string;
    }>;
    campaignIdeas: Array<{
      name: string;
      objective: string;
      targeting: string;
      creative: string;
    }>;
  };
  emailMarketing: {
    strategy: string;
    segmentation: string[];
    campaignTypes: string[];
    automationFlows: Array<{
      name: string;
      trigger: string;
      emails: string[];
    }>;
  };
  metrics: {
    kpis: Array<{
      metric: string;
      target: string;
      measurement: string;
    }>;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketingAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url || !apiKey) {
      setError('Please provide both URL and Anthropic API Key');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const reportText = `
COMPREHENSIVE MARKETING STRATEGY REPORT
=======================================

BUSINESS OVERVIEW
-----------------
Business Type: ${analysis.overview.businessType}
Target Audience: ${analysis.overview.targetAudience}
Value Proposition: ${analysis.overview.valueProposition}

Competitive Advantages:
${analysis.overview.competitiveAdvantages.map(a => `- ${a}`).join('\n')}

BRAND STRATEGY
--------------
Positioning: ${analysis.brandStrategy.positioning}
Voice & Tone: ${analysis.brandStrategy.voiceTone}

Key Messages:
${analysis.brandStrategy.keyMessages.map(m => `- ${m}`).join('\n')}

Brand Personality:
${analysis.brandStrategy.brandPersonality.map(p => `- ${p}`).join('\n')}

CONTENT STRATEGY
----------------
Content Pillars:
${analysis.contentStrategy.contentPillars.map(p => `- ${p}`).join('\n')}

Content Types:
${analysis.contentStrategy.contentTypes.map(t => `- ${t}`).join('\n')}

Posting Frequency: ${analysis.contentStrategy.postingFrequency}

Content Calendar:
${analysis.contentStrategy.contentCalendar.map(w => `
${w.week}:
${w.topics.map(t => `  - ${t}`).join('\n')}`).join('\n')}

SEO STRATEGY
------------
Primary Keywords:
${analysis.seoStrategy.primaryKeywords.map(k => `- ${k}`).join('\n')}

Secondary Keywords:
${analysis.seoStrategy.secondaryKeywords.map(k => `- ${k}`).join('\n')}

Content Recommendations:
${analysis.seoStrategy.contentRecommendations.map(r => `- ${r}`).join('\n')}

Technical SEO:
${analysis.seoStrategy.technicalSEO.map(t => `- ${t}`).join('\n')}

SOCIAL MEDIA STRATEGY
---------------------
${analysis.socialMediaStrategy.platforms.map(p => `
${p.platform}:
Strategy: ${p.strategy}
Posting Schedule: ${p.postingSchedule}

Content Ideas:
${p.contentIdeas.map(i => `- ${i}`).join('\n')}`).join('\n\n')}

PAID ADVERTISING
----------------
Recommended Channels:
${analysis.paidAdvertising.recommendedChannels.map(c => `- ${c}`).join('\n')}

Budget Allocation:
${analysis.paidAdvertising.budgetAllocation.map(b => `
- ${b.channel}: ${b.percentage}
  ${b.rationale}`).join('\n')}

Campaign Ideas:
${analysis.paidAdvertising.campaignIdeas.map(c => `
Campaign: ${c.name}
Objective: ${c.objective}
Targeting: ${c.targeting}
Creative: ${c.creative}`).join('\n\n')}

EMAIL MARKETING
---------------
Strategy: ${analysis.emailMarketing.strategy}

Segmentation:
${analysis.emailMarketing.segmentation.map(s => `- ${s}`).join('\n')}

Campaign Types:
${analysis.emailMarketing.campaignTypes.map(c => `- ${c}`).join('\n')}

Automation Flows:
${analysis.emailMarketing.automationFlows.map(f => `
${f.name}:
Trigger: ${f.trigger}
Emails: ${f.emails.join(' → ')}`).join('\n\n')}

KEY PERFORMANCE INDICATORS
--------------------------
${analysis.metrics.kpis.map(k => `
${k.metric}:
Target: ${k.target}
Measurement: ${k.measurement}`).join('\n\n')}

ACTION PLAN
-----------
Immediate Actions (Week 1-2):
${analysis.actionPlan.immediate.map(a => `- ${a}`).join('\n')}

Short-term Actions (Month 1-3):
${analysis.actionPlan.shortTerm.map(a => `- ${a}`).join('\n')}

Long-term Actions (Month 4-12):
${analysis.actionPlan.longTerm.map(a => `- ${a}`).join('\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-strategy-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>🚀 AI Marketing Agent</h1>
        <p>Replace your entire marketing team with AI. Just provide a URL.</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Enter your Anthropic API Key (starts with sk-ant-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !url || !apiKey}
        >
          {loading ? 'Analyzing...' : 'Generate Complete Marketing Strategy'}
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          Get comprehensive marketing strategy, SEO analysis, content plans, ad campaigns, and more
        </p>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing website and generating comprehensive marketing strategy...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
            This may take 30-60 seconds
          </p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <div className="results">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>📊 Complete Marketing Strategy</h2>
            <button className="download-btn" onClick={downloadReport}>
              💾 Download Report
            </button>
          </div>

          <div className="section">
            <h2>🎯 Business Overview</h2>
            <div className="metric-grid">
              <div className="metric-card">
                <h4>Business Type</h4>
                <p style={{ fontSize: '1.2rem' }}>{analysis.overview.businessType}</p>
              </div>
              <div className="metric-card">
                <h4>Target Audience</h4>
                <p style={{ fontSize: '1.2rem' }}>{analysis.overview.targetAudience}</p>
              </div>
            </div>
            <h3>Value Proposition</h3>
            <div className="highlight-box">
              <p>{analysis.overview.valueProposition}</p>
            </div>
            <h3>Competitive Advantages</h3>
            <ul>
              {analysis.overview.competitiveAdvantages.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>🎨 Brand Strategy</h2>
            <h3>Brand Positioning</h3>
            <p>{analysis.brandStrategy.positioning}</p>
            <h3>Voice & Tone</h3>
            <p>{analysis.brandStrategy.voiceTone}</p>
            <h3>Key Messages</h3>
            <ul>
              {analysis.brandStrategy.keyMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <h3>Brand Personality</h3>
            <div className="tag-list">
              {analysis.brandStrategy.brandPersonality.map((trait, i) => (
                <span key={i} className="tag">{trait}</span>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>📝 Content Strategy</h2>
            <h3>Content Pillars</h3>
            <div className="tag-list">
              {analysis.contentStrategy.contentPillars.map((pillar, i) => (
                <span key={i} className="tag">{pillar}</span>
              ))}
            </div>
            <h3>Content Types</h3>
            <ul>
              {analysis.contentStrategy.contentTypes.map((type, i) => (
                <li key={i}>{type}</li>
              ))}
            </ul>
            <h3>Posting Frequency</h3>
            <p>{analysis.contentStrategy.postingFrequency}</p>
            <h3>4-Week Content Calendar</h3>
            {analysis.contentStrategy.contentCalendar.map((week, i) => (
              <div key={i} className="highlight-box" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{week.week}</h4>
                <ul>
                  {week.topics.map((topic, j) => (
                    <li key={j}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>🔍 SEO Strategy</h2>
            <h3>Primary Keywords</h3>
            <div className="tag-list">
              {analysis.seoStrategy.primaryKeywords.map((kw, i) => (
                <span key={i} className="tag">{kw}</span>
              ))}
            </div>
            <h3>Secondary Keywords</h3>
            <div className="tag-list">
              {analysis.seoStrategy.secondaryKeywords.map((kw, i) => (
                <span key={i} className="tag">{kw}</span>
              ))}
            </div>
            <h3>Content Recommendations</h3>
            <ul>
              {analysis.seoStrategy.contentRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
            <h3>Technical SEO Priorities</h3>
            <ul>
              {analysis.seoStrategy.technicalSEO.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>📱 Social Media Strategy</h2>
            {analysis.socialMediaStrategy.platforms.map((platform, i) => (
              <div key={i} style={{ marginBottom: '2rem' }}>
                <h3>{platform.platform}</h3>
                <p><strong>Strategy:</strong> {platform.strategy}</p>
                <p><strong>Posting Schedule:</strong> {platform.postingSchedule}</p>
                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Content Ideas:</h4>
                <ul>
                  {platform.contentIdeas.map((idea, j) => (
                    <li key={j}>{idea}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>💰 Paid Advertising Strategy</h2>
            <h3>Recommended Channels</h3>
            <div className="tag-list">
              {analysis.paidAdvertising.recommendedChannels.map((channel, i) => (
                <span key={i} className="tag">{channel}</span>
              ))}
            </div>
            <h3>Budget Allocation</h3>
            {analysis.paidAdvertising.budgetAllocation.map((budget, i) => (
              <div key={i} className="highlight-box" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#667eea' }}>{budget.channel}: {budget.percentage}</h4>
                <p>{budget.rationale}</p>
              </div>
            ))}
            <h3>Campaign Ideas</h3>
            {analysis.paidAdvertising.campaignIdeas.map((campaign, i) => (
              <div key={i} className="highlight-box" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#764ba2' }}>{campaign.name}</h4>
                <p><strong>Objective:</strong> {campaign.objective}</p>
                <p><strong>Targeting:</strong> {campaign.targeting}</p>
                <p><strong>Creative:</strong> {campaign.creative}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>📧 Email Marketing Strategy</h2>
            <h3>Overall Strategy</h3>
            <p>{analysis.emailMarketing.strategy}</p>
            <h3>Audience Segmentation</h3>
            <ul>
              {analysis.emailMarketing.segmentation.map((seg, i) => (
                <li key={i}>{seg}</li>
              ))}
            </ul>
            <h3>Campaign Types</h3>
            <ul>
              {analysis.emailMarketing.campaignTypes.map((type, i) => (
                <li key={i}>{type}</li>
              ))}
            </ul>
            <h3>Automation Flows</h3>
            {analysis.emailMarketing.automationFlows.map((flow, i) => (
              <div key={i} className="highlight-box" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#667eea' }}>{flow.name}</h4>
                <p><strong>Trigger:</strong> {flow.trigger}</p>
                <p><strong>Email Sequence:</strong> {flow.emails.join(' → ')}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>📈 Key Performance Indicators</h2>
            {analysis.metrics.kpis.map((kpi, i) => (
              <div key={i} className="highlight-box" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#764ba2' }}>{kpi.metric}</h4>
                <p><strong>Target:</strong> {kpi.target}</p>
                <p><strong>Measurement:</strong> {kpi.measurement}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>✅ Action Plan</h2>
            <h3>🚨 Immediate Actions (Week 1-2)</h3>
            <ul>
              {analysis.actionPlan.immediate.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
            <h3>📅 Short-term Actions (Month 1-3)</h3>
            <ul>
              {analysis.actionPlan.shortTerm.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
            <h3>🎯 Long-term Actions (Month 4-12)</h3>
            <ul>
              {analysis.actionPlan.longTerm.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
