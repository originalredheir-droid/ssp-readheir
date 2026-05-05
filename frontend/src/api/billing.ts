import api from "./client";
import type { Organization, User } from "../types";

export interface SubscriptionPlan {
  tier: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  features: string[];
}

export interface BillingStatus {
  organization: Organization;
  last_payment: {
    plan_tier: string;
    amount: number;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    created_at: string;
  } | null;
}

export interface CheckoutOrder {
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  razorpay_key_id: string;
  payment_record_id: string;
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await api.get<SubscriptionPlan[]>("/billing/plans/");
  return response.data;
}

export async function fetchBillingStatus(): Promise<BillingStatus> {
  const response = await api.get<BillingStatus>("/billing/status/");
  return response.data;
}

export async function createCheckoutOrder(planTier: string): Promise<CheckoutOrder> {
  const response = await api.post<CheckoutOrder>("/billing/create-order/", { plan_tier: planTier });
  return response.data;
}

export async function refreshCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me/");
  return response.data;
}
