import { CustomersTabContent as OriginalCustomers } from './CustomersTabContent';

export function RecommendationTabContent() {
  // Render the CustomersTabContent with recommendation tab selected
  // This is a wrapper that selects the recommendation tab
  return <OriginalCustomers initialTab="recommendation" />;
}
