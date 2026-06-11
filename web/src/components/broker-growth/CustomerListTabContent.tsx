import { CustomersTabContent as OriginalCustomers } from './CustomersTabContent';

export function CustomerListTabContent() {
  return <OriginalCustomers initialTab="list" hideTabNavigation={true} />;
}
