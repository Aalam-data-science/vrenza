import React, { useState } from 'react';
import { Check, Shield, Zap, Building2, User, Stethoscope, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { paymentProvider } from '../../services/payments/provider';
import { toast } from '../../hooks/useToast';

export const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const tiers = [
    {
      id: 'patient-free',
      name: 'Personal Health Vault',
      audience: 'Individual Patients & Families',
      price: '$0',
      period: 'forever free',
      features: [
        'Zero-knowledge AES-256-GCM encrypted vault',
        'Deterministic AI Symptom Triage',
        'Emergency SOS telemetry packet',
        'Up to 3 active ephemeral share tokens',
        'Standard HL7 FHIR record export',
      ],
      cta: 'Current Default',
      highlighted: false,
    },
    {
      id: 'clinician-pro',
      name: 'Clinician Command',
      audience: 'Independent Physicians & Small Clinics',
      price: '$180',
      period: 'per provider / month',
      features: [
        'Everything in Personal Health Vault',
        'Three-Pane Clinician Command Center',
        'AI-assisted SOAP note generation with human sign-off',
        'Optical Prescription OCR & Drug Interaction Scanner',
        'Unlimited active patient share token decryption',
        'Custom EHR webhooks & FHIR R4 sync',
      ],
      cta: 'Upgrade to Clinician Pro',
      highlighted: true,
    },
    {
      id: 'health-system',
      name: 'Enterprise Health System',
      audience: 'Regional Hospital Networks & Payers',
      price: '$4,800',
      period: 'per hospital / month',
      features: [
        'Everything in Clinician Pro',
        'Regional Bed Ingress & Emergency CAD Integration',
        'SENTINEL Bio-Surveillance Outbreak Grid',
        'Custom VPC Deployment (AWS GovCloud, GCP, Azure)',
        'SAML 2.0 / Okta SSO & Hardware FIDO2 Auth',
        '24/7 Dedicated Clinical Operations Support',
      ],
      cta: 'Request Enterprise Trial',
      highlighted: false,
    },
  ];

  const handleStartCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setCheckoutComplete(false);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    const plan = tiers.find((t) => t.id === selectedPlan);
    const result = await paymentProvider.createSubscription(selectedPlan || 'clinician-pro', plan?.name || 'Pro');

    setIsProcessing(false);
    setCheckoutComplete(true);

    toast({
      type: 'SUCCESS',
      title: 'Subscription Activated (Simulation)',
      message: `Invoice ${result.invoiceId} generated. Mode: ${result.mode}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="clinical" size="sm">
          Commercial Licensing & Deployment
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Transparent, value-aligned healthcare pricing.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Patients retain free, unencumbered ownership of their encrypted health records forever. Providers and health systems pay based on compute and clinical coordination bandwidth.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            padding="lg"
            variant="surface"
            className={`relative flex flex-col justify-between ${
              tier.highlighted
                ? 'border-2 border-[#3C7049] shadow-md'
                : 'border border-[#E7E4DC]'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="clinical" size="xs">
                  Most Popular for Practitioners
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#22241F]">{tier.name}</h3>
                <p className="text-xs text-[#5A564C] mt-1">{tier.audience}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-[#22241F]">
                  {tier.price}
                </span>
                <span className="text-xs font-mono text-[#7A7568]">{tier.period}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#E7E4DC] text-xs">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#5A564C]">
                    <Check className="w-4 h-4 text-[#3C7049] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E7E4DC]">
              <Button
                variant={tier.highlighted ? 'primary' : 'outline'}
                className="w-full justify-center"
                onClick={() => handleStartCheckout(tier.id)}
              >
                {tier.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Simulated Checkout Modal */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        title={checkoutComplete ? 'Subscription Activated' : 'Simulated Enterprise Checkout'}
        subtitle="Simulated sandbox payment environment. No real funds will be charged."
        maxWidth="md"
      >
        {checkoutComplete ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#D9EBDE] text-[#3C7049] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#22241F]">
                License Successfully Provisioned
              </h4>
              <p className="text-xs text-[#5A564C]">
                Your organization profile has been upgraded. Full audit receipt and test invoice generated in sandbox mode.
              </p>
            </div>
            <Button className="w-full justify-center" onClick={() => setSelectedPlan(null)}>
              Return to Platform
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F4F2EE] rounded-lg border border-[#E7E4DC] space-y-1">
              <div className="flex justify-between font-semibold text-[#22241F]">
                <span>Selected Tier:</span>
                <span>{tiers.find((t) => t.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between text-[#5A564C]">
                <span>Billing Interval:</span>
                <span>Monthly (Simulated)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-[#22241F] block">Simulated Card Token</label>
              <input
                type="text"
                disabled
                value="tok_visa_4242424242424242_sandbox"
                className="w-full p-2.5 rounded border border-[#E7E4DC] bg-[#F4F2EE] font-mono text-[11px]"
              />
              <span className="text-[10px] text-[#7A7568]">Payment provider abstraction active</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlan(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleExecutePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Confirm Test Subscription'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
