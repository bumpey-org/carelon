const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default;

function toLocalISOString(date, isBeforeParam = false) {
    // If the 'before' date is today, set the time to one minute before midnight
    if (isBeforeParam) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.setHours(0, 0, 0, 0) === today.getTime()) {
            date.setHours(23, 59, 0, 0);
            return date.toISOString().split('.')[0];
        }
    }

    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split('.')[0];
}

// Initialize with your WooCommerce store credentials
const initializeWooCommerce = (location) => {
    let wooCommerceUrl, wooCommerceConsumerKey, wooCommerceConsumerSecret;

    switch (location.trim()) {
        case 'factory':
            wooCommerceUrl = process.env.NEXT_PUBLIC_FACTORYWOO_URL;
            wooCommerceConsumerKey = process.env.NEXT_PUBLIC_FACTORYWOO_ConsumerKey;
            wooCommerceConsumerSecret = process.env.NEXT_PUBLIC_FACTORYWOO_SecretKey;
            break;
        default: // Default to 'delish'
            wooCommerceUrl = process.env.NEXT_PUBLIC_DELISHWOO_URL;
            wooCommerceConsumerKey = process.env.NEXT_PUBLIC_DELISHWOO_ConsumerKey;
            wooCommerceConsumerSecret = process.env.NEXT_PUBLIC_DELISHWOO_SecretKey;
    }

    return new WooCommerceAPI({
        url: wooCommerceUrl,
        consumerKey: wooCommerceConsumerKey,
        consumerSecret: wooCommerceConsumerSecret,
        version: 'wc/v3',
        axiosConfig: {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
    });
};

export const getOrders = async (options = {}) => {
    try {
        const { after = '', before = '', location = 'delish' } = options;
        const WooCommerce = initializeWooCommerce(location);

        let allOrders = [];
        let page = 1;
        const perPage = 100;

        while (true) {
            const params = { per_page: perPage, page };
            if (after) params.after = toLocalISOString(new Date(after));
            if (before) params.before = toLocalISOString(new Date(before), true);

            const response = await WooCommerce.get("orders", params);
            const orders = response.data;

            if (orders.length === 0 || orders.length < perPage) {
                return allOrders.concat(orders);
            }

            allOrders = allOrders.concat(orders);
            page++;
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Function to get all customers with a specific role
export const getCustomers = async (options = {}) => {
    try {
        const { location = 'delish', role = 'legato' } = options;
        const WooCommerce = initializeWooCommerce(location);

        let customers = [];
        let page = 1;
        const perPage = 100; // Max allowed value

        while (true) {
            const params = {
                role: role, // You can pass different roles if needed
                per_page: perPage,
                page: page
            };

            const response = await WooCommerce.get("customers", params);
            const fetchedCustomers = response.data;

            if (fetchedCustomers.length === 0 || fetchedCustomers.length < perPage) {
                return customers.concat(fetchedCustomers);
            }

            customers = customers.concat(fetchedCustomers);
            page++;
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const calculateCustomerTotals = (customers, orders) => {
    let customerTotals = {};

    // Create a map for quick customer lookup
    const customerMap = customers.reduce((map, customer) => {
        map[customer.id] = customer;
        return map;
    }, {});

    orders.forEach(order => {
        const customerId = order.customer_id;
        const orderValue = Array.isArray(order.fee_lines) && order.fee_lines.length > 0
            ? Math.abs(parseFloat(order.fee_lines[0].amount) || 0)
            : 0;

        const customer = customerMap[customerId];

        if (customer) {
            if (!customerTotals[customerId]) {
                customerTotals[customerId] = {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    totalOrders: 0,
                    totalValue: 0
                };
            }

            customerTotals[customerId].totalOrders += 1;
            customerTotals[customerId].totalValue += orderValue;
        }
    });

    return Object.values(customerTotals).map(customer => ({
        ...customer,
        customerId: customer.id
    }));
};