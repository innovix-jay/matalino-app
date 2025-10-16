/**
 * Subscription & Payment Processing Engine
 * 
 * Handles in-app subscriptions, payments, and monetization
 * Like Woz's payment features but more comprehensive
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  interval: 'month' | 'year' | 'week';
  price: number; // in cents
  currency: string;
  features: string[];
  trialDays?: number;
  maxUsers?: number;
}

export interface PaymentIntegration {
  provider: 'stripe' | 'apple_pay' | 'google_pay' | 'paypal';
  configured: boolean;
  apiKeys?: {
    publishable: string;
    secret: string;
  };
  webhookUrl?: string;
}

export class SubscriptionEngine {
  /**
   * Generates subscription payment integration for mobile apps
   */
  async generateSubscriptionCode(
    framework: 'react-native' | 'flutter',
    plans: SubscriptionPlan[]
  ): Promise<{
    files: Record<string, string>;
    setup: string[];
  }> {
    const files: Record<string, string> = {};
    const setup: string[] = [];

    if (framework === 'react-native') {
      // Generate React Native IAP code
      files['src/services/subscription.ts'] = this.generateReactNativeSubscriptionService(plans);
      files['src/screens/PaywallScreen.tsx'] = this.generateReactNativePaywall(plans);
      files['src/components/SubscriptionCard.tsx'] = this.generateReactNativeSubscriptionCard();

      setup.push(
        'npm install react-native-iap react-native-purchases',
        'Configure Stripe/RevenueCat API keys',
        'Set up App Store Connect in-app purchases',
        'Configure Google Play billing'
      );
    } else {
      // Generate Flutter IAP code
      files['lib/services/subscription_service.dart'] = this.generateFlutterSubscriptionService(plans);
      files['lib/screens/paywall_screen.dart'] = this.generateFlutterPaywall(plans);
      files['lib/widgets/subscription_card.dart'] = this.generateFlutterSubscriptionCard();

      setup.push(
        'flutter pub add in_app_purchase',
        'flutter pub add purchases_flutter',
        'Configure RevenueCat',
        'Set up platform-specific billing'
      );
    }

    return { files, setup };
  }

  /**
   * Creates Stripe integration
   */
  async setupStripeIntegration(projectId: string): Promise<{
    checkoutCode: string;
    webhookHandler: string;
    subscriptionManagement: string;
  }> {
    return {
      checkoutCode: this.generateStripeCheckout(),
      webhookHandler: this.generateStripeWebhook(),
      subscriptionManagement: this.generateStripeSubscriptionManagement(),
    };
  }

  /**
   * Handles subscription lifecycle
   */
  async handleSubscriptionEvents(event: {
    type: string;
    userId: string;
    planId: string;
    status: string;
  }): Promise<void> {
    switch (event.type) {
      case 'subscription.created':
        await this.onSubscriptionCreated(event);
        break;
      case 'subscription.updated':
        await this.onSubscriptionUpdated(event);
        break;
      case 'subscription.canceled':
        await this.onSubscriptionCanceled(event);
        break;
      case 'payment.succeeded':
        await this.onPaymentSucceeded(event);
        break;
      case 'payment.failed':
        await this.onPaymentFailed(event);
        break;
    }
  }

  // Code generation methods
  private generateReactNativeSubscriptionService(plans: SubscriptionPlan[]): string {
    return `import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const SUBSCRIPTION_SKUS = Platform.select({
  ios: [${plans.map(p => `'${p.id}'`).join(', ')}],
  android: [${plans.map(p => `'${p.id}'`).join(', ')}],
});

export class SubscriptionService {
  async init() {
    try {
      await RNIap.initConnection();
      await this.getSubscriptions();
    } catch (err) {
      console.error('IAP init error', err);
    }
  }

  async getSubscriptions() {
    try {
      const products = await RNIap.getSubscriptions({ skus: SUBSCRIPTION_SKUS });
      return products;
    } catch (err) {
      console.error('Get subscriptions error', err);
      return [];
    }
  }

  async subscribe(sku: string) {
    try {
      await RNIap.requestSubscription({ sku });
    } catch (err) {
      console.error('Subscribe error', err);
    }
  }

  async restorePurchases() {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      return purchases;
    } catch (err) {
      console.error('Restore error', err);
      return [];
    }
  }
}

export const subscriptionService = new SubscriptionService();
`;
  }

  private generateReactNativePaywall(plans: SubscriptionPlan[]): string {
    return `import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { subscriptionService } from '../services/subscription';
import SubscriptionCard from '../components/SubscriptionCard';

export default function PaywallScreen() {
  const [products, setProducts] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const subs = await subscriptionService.getSubscriptions();
    setProducts(subs);
  };

  const handleSubscribe = async () => {
    if (selectedPlan) {
      await subscriptionService.subscribe(selectedPlan.productId);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>Unlock premium features</Text>

      {products.map((product) => (
        <SubscriptionCard
          key={product.productId}
          product={product}
          selected={selectedPlan?.productId === product.productId}
          onSelect={() => setSelectedPlan(product)}
        />
      ))}

      <TouchableOpacity
        style={[styles.button, !selectedPlan && styles.buttonDisabled]}
        onPress={handleSubscribe}
        disabled={!selectedPlan}
      >
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
`;
  }

  private generateReactNativeSubscriptionCard(): string {
    return `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SubscriptionCard({ product, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
    >
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.localizedPrice}/{product.subscriptionPeriodUnitIOS}</Text>
      <Text style={styles.description}>{product.description}</Text>
      {selected && <View style={styles.badge}><Text style={styles.badgeText}>Selected</Text></View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  cardSelected: { borderColor: '#6366f1', backgroundColor: '#f0f9ff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#6366f1', marginBottom: 8 },
  description: { fontSize: 14, color: '#666' },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
`;
  }

  private generateFlutterSubscriptionService(plans: SubscriptionPlan[]): string {
    return `import 'package:in_app_purchase/in_app_purchase.dart';

class SubscriptionService {
  final InAppPurchase _iap = InAppPurchase.instance;
  final Set<String> _productIds = {${plans.map(p => `'${p.id}'`).join(', ')}};

  Future<void> init() async {
    final bool available = await _iap.isAvailable();
    if (!available) return;
    
    await getProducts();
  }

  Future<List<ProductDetails>> getProducts() async {
    final ProductDetailsResponse response = await _iap.queryProductDetails(_productIds);
    return response.productDetails;
  }

  Future<void> subscribe(ProductDetails product) async {
    final PurchaseParam param = PurchaseParam(productDetails: product);
    await _iap.buyNonConsumable(purchaseParam: param);
  }

  Future<void> restorePurchases() async {
    await _iap.restorePurchases();
  }
}
`;
  }

  private generateFlutterPaywall(plans: SubscriptionPlan[]): string {
    return `import 'package:flutter/material.dart';
import '../services/subscription_service.dart';
import '../widgets/subscription_card.dart';

class PaywallScreen extends StatefulWidget {
  @override
  _PaywallScreenState createState() => _PaywallScreenState();
}

class _PaywallScreenState extends State<PaywallScreen> {
  final SubscriptionService _service = SubscriptionService();
  List<ProductDetails> _products = [];
  ProductDetails? _selectedProduct;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    final products = await _service.getProducts();
    setState(() => _products = products);
  }

  Future<void> _subscribe() async {
    if (_selectedProduct != null) {
      await _service.subscribe(_selectedProduct!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Choose Your Plan')),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          Text('Choose Your Plan', style: Theme.of(context).textTheme.headlineLarge),
          SizedBox(height: 24),
          ..._products.map((product) => SubscriptionCard(
            product: product,
            selected: _selectedProduct == product,
            onSelect: () => setState(() => _selectedProduct = product),
          )),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: _selectedProduct != null ? _subscribe : null,
            child: Text('Subscribe Now'),
          ),
        ],
      ),
    );
  }
}
`;
  }

  private generateFlutterSubscriptionCard(): string {
    return `import 'package:flutter/material.dart';

class SubscriptionCard extends StatelessWidget {
  final ProductDetails product;
  final bool selected;
  final VoidCallback onSelect;

  const SubscriptionCard({
    required this.product,
    required this.selected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: selected ? 4 : 1,
      color: selected ? Colors.blue.shade50 : null,
      child: InkWell(
        onTap: onSelect,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(product.title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Text(product.price, style: TextStyle(fontSize: 24, color: Colors.blue)),
              SizedBox(height: 8),
              Text(product.description),
              if (selected)
                Align(
                  alignment: Alignment.topRight,
                  child: Chip(label: Text('Selected'), backgroundColor: Colors.blue),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
`;
  }

  private generateStripeCheckout(): string {
    return `// Stripe Checkout Integration
import Stripe from 'stripe';

export async function createCheckoutSession(priceId: string, userId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const session = await stripe.checkout.sessions.create({
    customer: userId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: process.env.APP_URL + '/success',
    cancel_url: process.env.APP_URL + '/cancel',
  });
  
  return session.url;
}
`;
  }

  private generateStripeWebhook(): string {
    return `// Stripe Webhook Handler
import { buffer } from 'micro';

export async function handleStripeWebhook(req: any) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const event = stripe.webhooks.constructEvent(
    buf,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful subscription
      break;
    case 'customer.subscription.updated':
      // Handle subscription update
      break;
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
  }
}
`;
  }

  private generateStripeSubscriptionManagement(): string {
    return `// Subscription Management
export async function manageSubscription(userId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const session = await stripe.billingPortal.sessions.create({
    customer: userId,
    return_url: process.env.APP_URL + '/account',
  });
  
  return session.url;
}
`;
  }

  // Event handlers
  private async onSubscriptionCreated(event: any): Promise<void> {
    // Handle new subscription
  }

  private async onSubscriptionUpdated(event: any): Promise<void> {
    // Handle subscription changes
  }

  private async onSubscriptionCanceled(event: any): Promise<void> {
    // Handle cancellation
  }

  private async onPaymentSucceeded(event: any): Promise<void> {
    // Handle successful payment
  }

  private async onPaymentFailed(event: any): Promise<void> {
    // Handle failed payment
  }
}

export const subscriptionEngine = new SubscriptionEngine();

