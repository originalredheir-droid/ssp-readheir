import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createCheckoutOrder, fetchBillingStatus, fetchSubscriptionPlans, type BillingStatus, type SubscriptionPlan } from "../api/billing";

const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout script."));
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const BillingPage = () => {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadBilling = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [plansData, statusData] = await Promise.all([fetchSubscriptionPlans(), fetchBillingStatus()]);
      setPlans(plansData);
      setBillingStatus(statusData);
    } catch {
      setMessage("Unable to load billing details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const handleCheckout = async (planTier: string) => {
    setCheckoutLoading(true);
    setMessage(null);
    try {
      await loadRazorpayScript();
      const order = await createCheckoutOrder(planTier);
      const options = {
        key: order.razorpay_key_id,
        amount: order.order.amount,
        currency: order.order.currency,
        name: "SuperSports Organizer Billing",
        description: `Upgrade to ${planTier}`,
        order_id: order.order.id,
        handler: async (response: any) => {
          setMessage("Payment complete. Verifying subscription... Please wait.");
          await refreshUser();
          await loadBilling();
        },
        prefill: {
          name: user?.username,
          email: user?.email,
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage("Unable to initialize checkout. Try again later.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const activeTier = billingStatus?.organization?.subscription_status === "active" ? billingStatus.organization.plan_tier : null;

  const planCards = useMemo(
    () =>
      plans.map((plan) => (
        <div key={plan.tier} className="rounded-[28px] border border-slate-800 bg-[#111827] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-cyan-300">₹{(plan.amount / 100).toFixed(0)}</p>
              <p className="text-sm text-slate-400">per month</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-cyan-300">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedPlan(plan.tier);
              handleCheckout(plan.tier);
            }}
            disabled={checkoutLoading}
            className="mt-6 w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {activeTier === plan.tier ? "Current plan" : "Upgrade"}
          </button>
        </div>
      )),
    [plans, activeTier, checkoutLoading]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Billing</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Tenant subscription center</h1>
            <p className="mt-2 text-slate-400">Manage billing, upgrade plans, and keep your organizer access active.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {billingStatus?.organization?.subscription_status === "active" ? "Active subscription" : "Subscription required"}
          </div>
        </div>
      </div>

      {message ? (
        <div className="rounded-3xl border border-cyan-600 bg-[#0b1725] p-5 text-cyan-200">{message}</div>
      ) : null}

      <div className="rounded-[32px] border border-slate-800 bg-[#0f1725] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Subscription status</h2>
            <p className="mt-2 text-slate-400">Current tier: {billingStatus?.organization?.plan_tier ?? "unknown"}</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {billingStatus?.organization?.subscription_next_billing_at ? new Date(billingStatus.organization.subscription_next_billing_at).toLocaleDateString() : "Next billing not set"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">{planCards}</div>
    </section>
  );
};

export default BillingPage;
