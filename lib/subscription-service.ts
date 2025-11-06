// Firebase removed - all imports removed

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  currency: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  icon?: any // Icons are handled in components, not in service layer
  color?: string
  buttonColor?: string
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  planName: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  billingCycle: 'monthly' | 'yearly'
  amount: number
  currency: string
  startDate: Date
  endDate: Date
  nextBillingDate: Date
  paymentMethod?: string
  transactionId?: string
  features: string[]
  autoRenew: boolean
  cancelledAt?: Date
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionHistory {
  id: string
  userId: string
  subscriptionId: string
  action: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'renewed' | 'expired'
  fromPlan?: string
  toPlan?: string
  amount?: number
  currency?: string
  timestamp: Date
  details?: string
}

// Available subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    currency: 'KSH',
    features: [
      "Up to 3 listings",
      "Basic search and filters",
      "Standard customer support",
      "Basic analytics",
      "Mobile app access",
      "Secure payments",
    ],
    limitations: [
      "Limited to 3 active listings",
      "Basic support only",
      "Standard listing visibility",
    ],
    icon: null,
    color: "border-gray-200",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for active renters",
    price: {
      monthly: 2900,
      yearly: 29000,
    },
    currency: 'KSH',
    popular: true,
    features: [
      "Unlimited listings",
      "Advanced search and filters",
      "Priority customer support",
      "Advanced analytics & insights",
      "Mobile app access",
      "Secure payments",
      "Custom branding",
      "Booking management tools",
      "Automated messaging",
      "Performance optimization",
    ],
    limitations: [],
    icon: null,
    color: "border-blue-200",
    buttonColor: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For businesses and agencies",
    price: {
      monthly: 9900,
      yearly: 99000,
    },
    currency: 'KSH',
    features: [
      "Everything in Pro",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced reporting",
      "Multi-user accounts",
      "API access",
      "Custom domain",
      "Priority feature requests",
      "24/7 phone support",
      "Advanced security features",
      "Bulk operations",
    ],
    limitations: [],
    icon: null,
    color: "border-purple-200",
    buttonColor: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
  }
]

class SubscriptionService {
  private readonly SUBSCRIPTIONS_COLLECTION = 'userSubscriptions'
  private readonly SUBSCRIPTION_HISTORY_COLLECTION = 'subscriptionHistory'

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const subscriptionDoc = doc(db, this.SUBSCRIPTIONS_COLLECTION, userId)
      const subscriptionSnap = await getDoc(subscriptionDoc)
      
      if (subscriptionSnap.exists()) {
        const data = subscriptionSnap.data()
        return {
          id: subscriptionSnap.id,
          userId: data.userId,
          planId: data.planId,
          planName: data.planName,
          status: data.status,
          billingCycle: data.billingCycle,
          amount: data.amount,
          currency: data.currency,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          nextBillingDate: data.nextBillingDate?.toDate() || new Date(),
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          features: data.features || [],
          autoRenew: data.autoRenew,
          cancelledAt: data.cancelledAt?.toDate(),
          cancelReason: data.cancelReason,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting user subscription:', error)
      throw new Error('Failed to get subscription data')
    }
  }

  // Create or update user subscription
  async createOrUpdateSubscription(
    userId: string, 
    planId: string, 
    billingCycle: 'monthly' | 'yearly',
    paymentMethod?: string,
    transactionId?: string
  ): Promise<UserSubscription> {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Invalid plan ID')
      }

      const now = new Date()
      const amount = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly
      const endDate = new Date(now)
      
      // Calculate end date based on billing cycle
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      const subscriptionData: Partial<UserSubscription> = {
        userId,
        planId: plan.id,
        planName: plan.name,
        status: planId === 'free' ? 'active' : 'pending', // Free plan is immediately active
        billingCycle,
        amount,
        currency: plan.currency,
        startDate: now,
        endDate,
        nextBillingDate: planId === 'free' ? endDate : new Date(now.getTime() + (billingCycle === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)),
        paymentMethod,
        transactionId,
        features: plan.features,
        autoRenew: planId !== 'free',
        createdAt: now,
        updatedAt: now,
      }

      const subscriptionDoc = doc(db, this.SUBSCRIPTIONS_COLLECTION, userId)
      await setDoc(subscriptionDoc, {
        ...subscriptionData,
        startDate: serverTimestamp(),
        endDate: serverTimestamp(),
        nextBillingDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      // Log subscription history
      await this.logSubscriptionHistory(userId, userId, 'created', undefined, plan.name, amount, plan.currency)

      // Return the created subscription
      return await this.getUserSubscription(userId) as UserSubscription
    } catch (error) {
      console.error('Error creating/updating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  // Update subscription status (e.g., after successful payment)
  async updateSubscriptionStatus(
    userId: string, 
    status: UserSubscription['status'],
    transactionId?: string
  ): Promise<void> {
    try {
      const subscriptionDoc = doc(db, this.SUBSCRIPTIONS_COLLECTION, userId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      }

      if (transactionId) {
        updateData.transactionId = transactionId
      }

      if (status === 'active') {
        updateData.startDate = serverTimestamp()
      }

      await updateDoc(subscriptionDoc, updateData)

      // Log status change
      await this.logSubscriptionHistory(userId, userId, status === 'active' ? 'renewed' : 'cancelled')
    } catch (error) {
      console.error('Error updating subscription status:', error)
      throw new Error('Failed to update subscription status')
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string, reason?: string): Promise<void> {
    try {
      const subscriptionDoc = doc(db, this.SUBSCRIPTIONS_COLLECTION, userId)
      await updateDoc(subscriptionDoc, {
        status: 'cancelled',
        autoRenew: false,
        cancelledAt: serverTimestamp(),
        cancelReason: reason,
        updatedAt: serverTimestamp(),
      })

      // Log cancellation
      await this.logSubscriptionHistory(userId, userId, 'cancelled', undefined, undefined, undefined, undefined, reason)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  // Get subscription history for a user
  async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    try {
      const historyQuery = query(
        collection(db, this.SUBSCRIPTION_HISTORY_COLLECTION),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(historyQuery)
      const history: SubscriptionHistory[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        history.push({
          id: doc.id,
          userId: data.userId,
          subscriptionId: data.subscriptionId,
          action: data.action,
          fromPlan: data.fromPlan,
          toPlan: data.toPlan,
          amount: data.amount,
          currency: data.currency,
          timestamp: data.timestamp?.toDate() || new Date(),
          details: data.details,
        })
      })
      
      return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    } catch (error) {
      console.error('Error getting subscription history:', error)
      return []
    }
  }

  // Log subscription history
  private async logSubscriptionHistory(
    userId: string,
    subscriptionId: string,
    action: SubscriptionHistory['action'],
    fromPlan?: string,
    toPlan?: string,
    amount?: number,
    currency?: string,
    details?: string
  ): Promise<void> {
    try {
      const historyData: Omit<SubscriptionHistory, 'id'> = {
        userId,
        subscriptionId,
        action,
        fromPlan,
        toPlan,
        amount,
        currency,
        timestamp: new Date(),
        details,
      }

      await setDoc(doc(collection(db, this.SUBSCRIPTION_HISTORY_COLLECTION)), {
        ...historyData,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error logging subscription history:', error)
      // Don't throw error for history logging failure
    }
  }

  // Get plan by ID
  getPlanById(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null
  }

  // Get all available plans
  getAllPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      return subscription?.status === 'active' && new Date() < subscription.endDate
    } catch (error) {
      console.error('Error checking active subscription:', error)
      return false
    }
  }

  // Get user's subscription features
  async getUserFeatures(userId: string): Promise<string[]> {
    try {
      const subscription = await this.getUserSubscription(userId)
      if (subscription && subscription.status === 'active') {
        return subscription.features
      }
      
      // Return free plan features as default
      const freePlan = this.getPlanById('free')
      return freePlan?.features || []
    } catch (error) {
      console.error('Error getting user features:', error)
      return []
    }
  }
}

export const subscriptionService = new SubscriptionService()


