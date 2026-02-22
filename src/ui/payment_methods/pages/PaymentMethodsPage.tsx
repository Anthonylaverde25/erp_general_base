import { lazy } from 'react';

const PaymentMethodsTabView = lazy(() => import('../components/PaymentMethodsTabView'));

export default function PaymentMethodsPage() {
	return <PaymentMethodsTabView />;
}
