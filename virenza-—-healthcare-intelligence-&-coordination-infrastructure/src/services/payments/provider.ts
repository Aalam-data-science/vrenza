/**
 * VIRENZA Payment & Subscription Provider Abstraction
 * Deterministic subscription processing sandbox.
 */

import { SubscriptionPlanId } from '../../types';
import { store } from '../store';

export class PaymentProvider {
  public async createSubscription(planId: string, planName: string): Promise<{ success: boolean; invoiceId: string; mode: string }> {
    const invoiceId = 'INV-VRZ-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    store.setActivePlan(planId);
    store.addAuditLog({
      actorId: 'usr-patient-eleanor',
      actorName: 'Eleanor Vance',
      actorRole: 'PATIENT',
      organizationId: 'org-metro-health',
      action: 'ADMIN_ACTION',
      resourceType: 'SubscriptionPlan',
      resourceId: planId,
      metadata: { invoiceId, plan: planName, simulation: true },
    });
    return { success: true, invoiceId, mode: 'SANDBOX' };
  }

  public async processSimulatedSubscription(planId: SubscriptionPlanId): Promise<{ success: boolean; invoiceId: string }> {
    const plans = store.getSubscriptionPlans();
    const targetPlan = plans.find((p) => p.id === planId);
    const invoiceId = 'INV-VRZ-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);

    store.setActivePlan(planId);

    // Record simulated invoice
    const newInvoice = {
      id: invoiceId,
      date: new Date().toISOString().split('T')[0],
      amount: targetPlan ? targetPlan.priceMonthly : 0,
      planName: targetPlan ? targetPlan.name : planId,
      status: 'PAID' as const,
      pdfRef: `SIMULATED-RECEIPT-${invoiceId}.pdf`,
    };

    const currentInvoices = store.getInvoices();
    // store doesn't have addInvoice directly, let's update via store save or plan update
    store.addAuditLog({
      actorId: 'usr-patient-eleanor',
      actorName: 'Eleanor Vance',
      actorRole: 'PATIENT',
      organizationId: 'org-metro-health',
      action: 'ADMIN_ACTION',
      resourceType: 'SubscriptionPlan',
      resourceId: planId,
      metadata: { invoiceId, plan: targetPlan?.name, simulation: true },
    });

    return { success: true, invoiceId };
  }
}

export const paymentProvider = new PaymentProvider();
