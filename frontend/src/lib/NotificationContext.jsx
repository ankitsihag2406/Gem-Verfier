import { createContext, useContext, useState, useCallback } from "react";
import { MOCK_BIDS, MOCK_TENDERS } from "@/lib/mockData";

const NotificationContext = createContext(null);

/**
 * Tracks which tenders/bids have been "viewed" so sidebar badges
 * decrease as the user navigates through the app.
 *
 * - Tenders badge = number of tenders with at least one unviewed bid
 * - Audit Log badge = total unviewed bid audit entries (each bid = 1 entry)
 */
export function NotificationProvider({ children }) {
  // Sets of IDs the user has already viewed
  const [viewedBids, setViewedBids] = useState(new Set());
  const [activityViewed, setActivityViewed] = useState(false);

  const markBidViewed = useCallback((bidId) => {
    setViewedBids(prev => {
      if (prev.has(bidId)) return prev;
      const next = new Set(prev);
      next.add(bidId);
      return next;
    });
  }, []);

  const markActivityViewed = useCallback(() => {
    setActivityViewed(true);
  }, []);

  // Tenders badge: count of tenders that have at least one unviewed bid
  const unviewedTenderCount = MOCK_TENDERS.filter(tender => {
    const tenderBids = MOCK_BIDS.filter(b => b.tenderId === tender.id);
    return tenderBids.some(b => !viewedBids.has(b.id));
  }).length;

  // Audit log badge: number of unviewed bid entries
  const unviewedAuditCount = activityViewed
    ? 0
    : MOCK_BIDS.filter(b => !viewedBids.has(b.id)).length;

  return (
    <NotificationContext.Provider value={{
      viewedBids,
      markBidViewed,
      markActivityViewed,
      unviewedTenderCount,
      unviewedAuditCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
