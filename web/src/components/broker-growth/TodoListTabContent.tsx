import { CustomersTabContent as OriginalCustomers } from './CustomersTabContent';

export function TodoListTabContent() {
  return <OriginalCustomers initialTab="todo" hideTabNavigation={true} />;
}
