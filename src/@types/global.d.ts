interface AuthDataObject {
	name?: string
	email?: string
	address: string
	lasttime: number
	created: number
}

interface CustomerDataObject {
	customerId?: string
	customerName?: string
	customerSpent?: number
}

interface OrderDataObject {
	customerId?: string
	orderId?: string
	totalCent?: number
	orderDate?: number
}