import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useProfile } from "../hooks/useProfile";
import { createCheckoutSession } from "../services/plan.service";
import { getStoredUser } from "../utils/storedUser";
import { isPremiumPlan, resolveUserPlan } from "../utils/plan";
import type { PremiumFeature } from "../utils/plan";
import type { UserPlan } from "../types/api";
import { useToast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/errorMessage";
import UpgradeToPremiumModal from "../components/premium/UpgradeToPremiumModal";

type PlanContextValue = {
  plan: UserPlan;
  isPremium: boolean;
  isPlanReady: boolean;
  openUpgradeModal: (feature?: PremiumFeature) => void;
  closeUpgradeModal: () => void;
  upgradeToPremium: () => Promise<void>;
  isUpgrading: boolean;
};

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { data: profile, isFetched } = useProfile();
  const storedUser = getStoredUser();
  const token = localStorage.getItem("token");

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<PremiumFeature | null>(
    null
  );
  const upgradeFeatureRef = useRef<PremiumFeature | null>(null);

  const plan = resolveUserPlan(profile?.plan ?? storedUser.plan);
  const isPremium = isPremiumPlan(plan);
  const isPlanReady = !token || isFetched || Boolean(storedUser.id);

  const closeUpgradeModal = useCallback(() => {
    upgradeFeatureRef.current = null;
    setUpgradeModalOpen(false);
    setUpgradeFeature(null);
  }, []);

  const openUpgradeModal = useCallback((feature?: PremiumFeature) => {
    const next = feature ?? null;
    upgradeFeatureRef.current = next;
    setUpgradeFeature(next);
    setUpgradeModalOpen(true);
  }, []);

  const checkoutMutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });

  const { mutateAsync, isPending } = checkoutMutation;

  const upgradeToPremium = useCallback(async () => {
    try {
      await mutateAsync();
    } catch (err) {
      const messageKey = getErrorMessage(err, "premium.errors.checkoutFailed");
      showToast(t(messageKey, { defaultValue: t("premium.errors.checkoutFailed") }), "error");
    }
  }, [mutateAsync, showToast, t]);

  const value = useMemo(
    () => ({
      plan,
      isPremium,
      isPlanReady,
      openUpgradeModal,
      closeUpgradeModal,
      upgradeToPremium,
      isUpgrading: isPending,
    }),
    [
      plan,
      isPremium,
      isPlanReady,
      openUpgradeModal,
      closeUpgradeModal,
      upgradeToPremium,
      isPending,
    ]
  );

  return (
    <PlanContext.Provider value={value}>
      {children}
      <UpgradeToPremiumModal
        open={upgradeModalOpen}
        feature={upgradeFeature}
        isUpgrading={isPending}
        onClose={closeUpgradeModal}
        onUpgrade={() => void upgradeToPremium()}
      />
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
