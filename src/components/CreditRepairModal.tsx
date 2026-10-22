import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  Info,
  HelpCircle,
  BarChart3,
  Globe2,
  X,
  Building2,
  Coins,
  Copy,
  Check,
  FileText,
  Send,
  AlertTriangle,
  Lock,
  Flame,
  Scale,
  Heart,
  Crown
} from 'lucide-react';

interface CreditRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoins: (amount: number) => void;
  lang?: string;
}

interface ActionableStrategy {
  id: number;
  titleEn: string;
  categoryEn: string;
  ico: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusArea: string;
  timeframe: string;
  summaryEn: string;
  stepByStepEn: string[];
  templateTitleEn?: string;
  templateTextEn?: string;
  rewardAmount: number;
}

const ACTIONABLE_STRATEGIES: ActionableStrategy[] = [
  {
    id: 1,
    titleEn: 'FCRA Section 609: Understanding Credit Report Verification Rights',
    categoryEn: 'Consumer Legal Education',
    ico: '📑',
    difficulty: 'Intermediate',
    focusArea: 'Report Accuracy Rights',
    timeframe: '30 to 45 Days Review',
    summaryEn: 'Under Section 609 of the US Fair Credit Reporting Act (FCRA) and Canadian Equifax/TransUnion consumer protection standards, credit reporting agencies are legally required to verify the accuracy of information upon written request. Knowing your right to request verification is a foundational pillar of personal financial literacy.',
    stepByStepEn: [
      'Obtain your official credit reports from AnnualCreditReport.com (US) or Equifax/TransUnion (Canada).',
      'Review your reporting statements to identify any inaccurate, outdated, or unverified information.',
      'Use the educational dispute letter template below to formally request verification via Certified Mail from the credit reporting agencies.',
      'Under FCRA guidelines, credit reporting agencies typically have 30 days to review disputes and verify information accuracy.'
    ],
    templateTitleEn: 'Sample FCRA Section 609 Verification Request Template',
    templateTextEn: `[Your Full Legal Name]
[Your Street Address]
[City, State, Zip Code]
[Social Security Number / SIN (Last 4 digits): XXXX]
[Date of Birth: MM/DD/YYYY]

To: [Credit Reporting Bureau Name: Experian / Equifax / TransUnion]
[Credit Bureau Address]

Subject: Request for Information Verification Pursuant to FCRA Section 609 (15 U.S.C. § 1681g)

Dear Dispute Department,

I am writing to formally request verification regarding the following item(s) appearing on my credit file:

1. Account Name: [Creditor Name] | Account Number: [XXXX-XXXX]
2. Reason for Request: Verification of reported accuracy and documentation.

Under Section 609 of the Fair Credit Reporting Act (15 U.S.C. § 1681g), consumers have the right to request verification of reported information. Please review your records and verify that this account information is accurate and properly documented.

If this information cannot be verified in accordance with federal reporting guidelines within thirty (30) days, please update or correct my credit file accordingly.

Sincerely,
[Your Printed Signature]
[Your Full Legal Name]`,
    rewardAmount: 100
  },
  {
    id: 2,
    titleEn: 'Pay-for-Delete Settlement Negotiation Concepts',
    categoryEn: 'Collection Settlement Wisdom',
    ico: '🤝',
    difficulty: 'Advanced',
    focusArea: 'Creditor Negotiation',
    timeframe: '15 to 30 Days Process',
    summaryEn: 'Understanding how collection agencies operate is crucial when settling outstanding accounts. Paying an account without written clarification regarding reporting status may leave the record intact as a "Paid Collection". Learning how to request written settlement terms is a key financial skill.',
    stepByStepEn: [
      'Maintain written communications with creditors and collection representatives rather than relying solely on verbal phone calls.',
      'Inquire whether the creditor or agency offers written settlement agreements that include trade line deletion upon full resolution of agreed funds.',
      'Ensure all agreed terms are received in official written correspondence before transmitting settlement funds.',
      'Retain copies of all written agreements and payment receipts for your permanent personal financial records.'
    ],
    templateTitleEn: 'Sample Written Settlement Proposal Letter Template',
    templateTextEn: `[Your Full Name]
[Your Address]
[Date]

To: [Collection Agency or Creditor Name]
[Address]

Re: Account Number [XXXX-XXXX] | Original Creditor: [Name]

Dear Account Manager,

This letter is a formal inquiry regarding a potential settlement for the above-referenced account. I am offering a one-time settlement payment of $[Amount] in exchange for full satisfaction of this account and written confirmation of trade line removal from major reporting agencies.

Please note that this proposal is contingent upon your written agreement to update reporting bureaus accordingly upon receipt of funds. This correspondence does not constitute an admission of liability.

If your agency agrees to these terms, please provide a signed confirmation on official company letterhead.

Sincerely,
[Your Printed Name]`,
    rewardAmount: 100
  },
  {
    id: 3,
    titleEn: 'Authorized User Concepts & Credit History Length',
    categoryEn: 'Credit History Building',
    ico: '🚀',
    difficulty: 'Beginner',
    focusArea: 'Tradeline Principles',
    timeframe: '30 to 45 Days Awareness',
    summaryEn: 'The length of your credit history accounts for approximately 15% of your FICO score calculation. Understanding how being added as an Authorized User on an established, well-maintained account functions is a recognized educational concept in personal finance.',
    stepByStepEn: [
      'Learn how major financial institutions treat Authorized User accounts on primary credit cards.',
      'Understand that primary cardholders with long-standing positive payment records and low balance utilization positively influence overall reported history.',
      'Be aware that both positive and negative payment behaviors on shared tradelines may impact reported records.',
      'Consult with primary cardholders to understand account terms before being added as an Authorized User.'
    ],
    rewardAmount: 100
  },
  {
    id: 4,
    titleEn: 'Statement Closing Dates vs Due Dates & The 15/3 Payment Concept',
    categoryEn: 'Utilization Management',
    ico: '💡',
    difficulty: 'Beginner',
    focusArea: 'Balance Reporting Science',
    timeframe: 'Monthly Cycle Awareness',
    summaryEn: 'Card issuers generally transmit account balances to credit bureaus on your monthly Statement Closing Date, not your Payment Due Date. Understanding the mathematical difference between these two dates allows consumers to manage reported credit utilization effectively.',
    stepByStepEn: [
      'Identify your card\'s Statement Closing Date from your monthly billing statement.',
      'Learn the 15/3 concept: Making a partial payment 15 days before the closing date and a final balance reduction 3 days before the closing date.',
      'Aim to keep reported utilization below 10% of your total credit limit to demonstrate responsible balance management.',
      'Avoid carrying unnecessary revolving interest charges by paying remaining statement balances in full.'
    ],
    rewardAmount: 100
  },
  {
    id: 5,
    titleEn: 'Goodwill Adjustment Requests for Isolated Historical Late Marks',
    categoryEn: 'Creditor Relations',
    ico: '💌',
    difficulty: 'Intermediate',
    focusArea: 'Courtesy Adjustments',
    timeframe: '14 to 30 Days Communication',
    summaryEn: 'For long-standing bank customers who experienced an isolated late payment due to an unexpected hardship, submitting a polite Goodwill Adjustment letter is an established educational method to request a courtesy reporting adjustment.',
    stepByStepEn: [
      'Locate the customer relations or correspondence address for your financial institution.',
      'Draft a professional, courteous letter explaining the isolated nature of the past missed payment.',
      'Highlight your subsequent ongoing record of consistent, on-time payments.',
      'Respectfully request that the creditor consider a voluntary courtesy adjustment to your reporting records.'
    ],
    templateTitleEn: 'Sample Goodwill Courtesy Adjustment Request Letter',
    templateTextEn: `[Your Full Name]
[Your Address]
[Account Number: XXXX-XXXX]
[Date]

To: Customer Relations Management
[Financial Institution Name]

Subject: Request for Courtesy Goodwill Adjustment Regarding Account #[XXXX-XXXX]

Dear Customer Service Management,

I am writing to respectfully request a goodwill review regarding a late payment mark recorded on my account in [Month, Year].

I take great pride in maintaining a responsible relationship with your institution, as reflected by my subsequent [12/24] months of consistent, on-time payments. At the time of the missed payment, I experienced an isolated personal circumstance [e.g. medical emergency / travel / job transition].

In light of my long-term account loyalty and ongoing clean record, I kindly ask if your management team would consider a voluntary goodwill adjustment to update my reporting file.

Thank you for your time, consideration, and continued partnership.

Sincerely,
[Your Full Legal Name]`,
    rewardAmount: 100
  }
];

export const CreditRepairModal: React.FC<CreditRepairModalProps> = ({
  isOpen,
  onClose,
  onAddCoins
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<ActionableStrategy>(ACTIONABLE_STRATEGIES[0]);
  const [claimedStrategies, setClaimedStrategies] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('worldplay_claimed_strategies_v2') || '[]');
    } catch {
      return [];
    }
  });
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaimReward = (strat: ActionableStrategy) => {
    if (claimedStrategies.includes(strat.id)) return;

    const updated = [...claimedStrategies, strat.id];
    setClaimedStrategies(updated);
    localStorage.setItem('worldplay_claimed_strategies_v2', JSON.stringify(updated));

    onAddCoins(strat.rewardAmount);
    setToastMsg(`+${strat.rewardAmount} Golden Darics added to Treasury!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyTemplateToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in dir-ltr overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-emerald-500/40 rounded-2xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 text-slate-100 my-auto max-h-[92vh] flex flex-col text-left font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/25 pb-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-teal-300 to-amber-300">
                US & Canada Credit Literacy & Financial Wisdom Guide
              </h2>
              <p className="text-xs text-emerald-200/70">
                Educational insights, financial rights awareness, and sample dispute templates for North American consumers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-400/60 hover:text-emerald-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Q&A Message: What does Chess have to do with Credit Cards? */}
        <div className="mb-3 p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/50 rounded-xl space-y-2 shadow-md">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Q: What does Chess have to do with Credit Repair & Financial Literacy?</span>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-normal bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <strong>Answer:</strong> True strategic mastery on the chessboard requires <strong>complete peace of mind and mental tranquility</strong>. When your mind is burdened by financial anxiety or credit worries, it is impossible to focus on chess or enjoy life&apos;s leisure activities. We created this section as a <strong>thoughtful gift of wisdom</strong> to our players—so you can empower your real-world financial health, resolve credit burdens, free your mind, and play chess and enjoy gaming with total peace of mind!
          </p>
        </div>

        {/* Mandatory Legal & Educational Disclaimer */}
        <div className="mb-3 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-200/90">
          <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-100/80">
            <strong>Disclaimer:</strong> This section is strictly for educational, informational, and financial literacy purposes. We do NOT provide credit repair services, legal advice, or financial guarantees. Consult a certified financial advisor for personalized advice.
          </p>
        </div>

        {/* SEO Financial Keywords Bar */}
        <div className="mb-3 p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
            <BookOpen className="w-3.5 h-3.5" /> Financial Literacy Focus:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-emerald-300/80">
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">FICO Score Education</span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">FCRA Consumer Rights</span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Credit Card Utilization</span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Debt Management Literacy</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-y-auto pl-1">
          
          {/* Left Column: Actionable Strategies Selector */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center justify-between">
              <span>5 Core Literacy Topics</span>
              <span className="text-[10px] text-emerald-200/60 font-mono">
                {claimedStrategies.length} of {ACTIONABLE_STRATEGIES.length} Completed
              </span>
            </div>

            {ACTIONABLE_STRATEGIES.map((strat) => {
              const isSelected = selectedStrategy.id === strat.id;
              const isClaimed = claimedStrategies.includes(strat.id);

              return (
                <button
                  key={strat.id}
                  onClick={() => setSelectedStrategy(strat)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-lg text-emerald-100 ring-1 ring-emerald-400/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-amber-200/80'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{strat.ico}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        {strat.categoryEn}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 font-mono">
                        {strat.difficulty}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-amber-200 truncate leading-snug">
                      {strat.titleEn}
                    </div>
                  </div>
                  {isClaimed && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}

            {/* Practical Advice Summary Box */}
            <div className="p-3.5 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-100">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Consumer Credit Best Practices:
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                <li>All official FCRA dispute submissions are 100% free directly with Experian, Equifax, and TransUnion.</li>
                <li>Always request written confirmation for any financial settlement agreements.</li>
                <li>Length of credit history represents 15% of your standard FICO score model.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Detailed Step-by-Step & Legal Letter Templates */}
          <div className="md:col-span-7 bg-slate-900/95 border border-emerald-500/30 p-4 sm:p-5 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Title & Metadata */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedStrategy.ico}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-200">
                      {selectedStrategy.titleEn}
                    </h3>
                    <p className="text-[11px] text-emerald-300/60 font-mono">
                      {selectedStrategy.categoryEn} • Focus: {selectedStrategy.focusArea}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 block">
                    {selectedStrategy.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {selectedStrategy.timeframe}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedStrategy.summaryEn}
              </p>

              {/* Educational Execution Steps */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Educational Overview & Step-by-Step Guidance:
                </div>
                <ol className="space-y-2 text-xs text-slate-200 pl-2">
                  {selectedStrategy.stepByStepEn.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sample Letter Template Section */}
              {selectedStrategy.templateTextEn && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      {selectedStrategy.templateTitleEn}
                    </span>
                    <button
                      onClick={() => copyTemplateToClipboard(selectedStrategy.templateTextEn!)}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border border-amber-500/40"
                    >
                      {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTemplate ? 'Copied!' : 'Copy Educational Template'}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-200/90 whitespace-pre-wrap overflow-x-auto max-h-48 leading-relaxed">
                    {selectedStrategy.templateTextEn}
                  </pre>
                </div>
              )}

            </div>

            {/* Bottom Reward Action */}
            <div className="border-t border-emerald-500/20 pt-3 flex items-center justify-between">
              {claimedStrategies.includes(selectedStrategy.id) ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>+{selectedStrategy.rewardAmount} Golden Darics Claimed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleClaimReward(selectedStrategy)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  <span>Read Literacy Topic • Claim +{selectedStrategy.rewardAmount} Darics</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>

        </div>

        {/* Floating Toast Notification */}
        {toastMsg && (
          <div className="mt-3 p-3 bg-emerald-950 border border-emerald-400 text-emerald-200 text-xs rounded-xl text-center font-bold animate-bounce">
            {toastMsg}
          </div>
        )}

      </div>
    </div>
  );
};
