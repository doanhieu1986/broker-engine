import { CustomersTabContent as OriginalCustomers } from './CustomersTabContent';

export function RecommendationTabContent() {
  return <OriginalCustomers initialTab="recommendation" hideTabNavigation={true} />;
}
