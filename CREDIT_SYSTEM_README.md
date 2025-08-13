# Credit-Based Pricing System Implementation

This document outlines the implementation of a comprehensive credit-based pricing system for the FeedAQ Academy Dashboard.

## Overview

The credit system allows users to:
- Purchase credit packages at different price points
- Use credits to access various services (courses, mock interviews, career guidance, etc.)
- Track credit usage and transaction history
- Get low-credit warnings and easy top-up options

## Architecture

### Core Components

#### 1. Zustand Store (`/src/zustland/store.js`)

**`useCreditStore`** - Central state management for credits:

```javascript
const { 
    currentCredits,              // Current credit balance
    totalCreditsEverPurchased,   // Lifetime credit purchases
    creditsUsedThisMonth,       // Monthly usage tracking
    creditsExpiringSoon,        // Credits about to expire
    creditHistory,              // Transaction history
    loading,                    // Loading states
    addCredits,                 // Add credits (purchase)
    deductCredits,              // Deduct credits (usage)
    fetchCreditBalance,         // Get current balance from API
    purchaseCredits            // Purchase new credits
} = useCreditStore();
```

#### 2. Credit Widget (`/src/components/CreditWidget.jsx`)

**Reusable component** for displaying credit balance and quick purchase options:

```jsx
<CreditWidget 
    showBalance={true}          // Show current balance
    showQuickPurchase={true}    // Show quick purchase button
    compact={false}             // Compact mode for headers
    className="custom-class"    // Additional styling
/>
```

**Credit Transaction Hook** (`useCreditTransaction`):
```javascript
const { 
    checkAndDeductCredits,      // Check balance & deduct if sufficient
    InsufficientCreditsModal,   // Modal for insufficient credits
    currentCredits             // Current balance
} = useCreditTransaction();
```

#### 3. Service Pricing Grid (`/src/components/ServicePricingGrid.jsx`)

**Interactive service catalog** with credit-based pricing:

```jsx
<ServicePricingGrid 
    services={customServices}   // Optional: custom service array
    title="Available Services"  // Grid title
    subtitle="Choose a service" // Grid subtitle
    onServiceSelect={handler}   // Callback when service is selected
    className="custom-class"    // Additional styling
/>
```

#### 4. Billing Interface (`/src/components-xm/AccountSettings/Billing.jsx`)

**Comprehensive billing dashboard** with:
- Credit balance overview
- Purchase credit packages
- Service pricing information
- Transaction history
- Usage analytics

## Integration Guide

### 1. Basic Credit Display

For displaying credits in headers or navigation:

```jsx
import CreditWidget from '@/components/CreditWidget.jsx';

// Compact display for headers
<CreditWidget compact={true} showQuickPurchase={true} />
```

### 2. Service Integration

For any service that requires credits:

```jsx
import { useCreditTransaction } from '@/components/CreditWidget.jsx';

const YourServiceComponent = () => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    
    const handleServiceUse = () => {
        const success = checkAndDeductCredits(
            50,                                    // Credit cost
            'Mock Interview Session',              // Description
            'interview'                           // Service type
        );
        
        if (success) {
            // Proceed with service
            startService();
        }
        // If insufficient, modal automatically shows
    };

    return (
        <>
            <Button onClick={handleServiceUse}>
                Start Interview (50 credits)
            </Button>
            <InsufficientCreditsModal />
        </>
    );
};
```

### 3. Course Enrollment

Example for course enrollment with credits:

```jsx
import { useCreditTransaction } from '@/components/CreditWidget.jsx';

const CourseCard = ({ course }) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    
    const handleEnrollment = () => {
        const success = checkAndDeductCredits(
            course.creditCost,
            `Course Enrollment: ${course.title}`,
            'course'
        );
        
        if (success) {
            enrollUserInCourse(course.id);
        }
    };

    return (
        <>
            <div className="course-card">
                <h3>{course.title}</h3>
                <p>Cost: {course.creditCost} credits</p>
                <Button onClick={handleEnrollment}>
                    Enroll Now
                </Button>
            </div>
            <InsufficientCreditsModal />
        </>
    );
};
```

## Credit Packages

### Default Packages

1. **Starter Pack** - ₹999 (500 credits)
   - Perfect for beginners
   - 1-2 courses access
   - Valid for 6 months

2. **Professional Pack** - ₹2,499 (1,500 credits) 
   - Most popular choice
   - 3-5 courses access
   - Priority support
   - Valid for 12 months

3. **Enterprise Pack** - ₹4,999 (3,000 credits)
   - Best value for money
   - Unlimited course access
   - 24/7 premium support
   - Valid for 18 months

### Service Costs

- **Course Access**: 100-150 credits
- **Mock Interview**: 50-75 credits
- **Career Guidance**: 75-100 credits
- **Resume Review**: 25-50 credits
- **Skill Assessment**: 30-60 credits

## API Integration

### Required API Endpoints

The system expects these API endpoints to be implemented:

```javascript
// Get user's current credit balance
POST /getUserCredits
Response: {
    data: {
        currentCredits: number,
        totalPurchased: number,
        usedThisMonth: number,
        expiringSoon: number
    }
}

// Get credit transaction history
POST /getCreditHistory
Response: {
    data: {
        history: [
            {
                id: string,
                date: string,
                type: 'purchase' | 'usage',
                amount: number,
                description: string,
                credits: string,
                serviceType?: string
            }
        ]
    }
}

// Purchase credits
POST /purchaseCredits
Body: {
    planId: string,
    amount: number,
    credits: number
}
Response: {
    success: boolean,
    transactionId?: string,
    message?: string
}
```

## Features

### User Experience
- **Transparent Pricing**: All services clearly show credit costs
- **Flexible Packages**: Multiple credit packages for different needs
- **Usage Tracking**: Detailed history and analytics
- **Quick Top-up**: Easy credit purchase from anywhere in the app
- **Expiry Warnings**: Notifications for credits about to expire

### Admin Features
- **Credit Management**: Easy credit adjustment and tracking
- **Usage Analytics**: Detailed insights into credit consumption
- **Package Management**: Flexible pricing and package configuration

### Technical Features
- **State Management**: Centralized Zustand store
- **Real-time Updates**: Automatic balance updates after transactions
- **Error Handling**: Graceful handling of insufficient credits
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Screen reader friendly components

## Customization

### Custom Service Costs

```javascript
const customServices = [
    {
        id: 'premium-consultation',
        type: 'consultation',
        name: 'Premium Career Consultation',
        description: 'One-on-one with industry expert',
        credits: 200,
        duration: '90 mins',
        features: ['Personalized advice', 'Action plan', 'Follow-up email']
    }
];

<ServicePricingGrid services={customServices} />
```

### Custom Credit Packages

```javascript
const customPlans = [
    {
        id: 'student',
        name: 'Student Pack',
        credits: 250,
        price: 499,
        originalPrice: 699,
        discount: 28,
        popular: false,
        features: ['Student discount', 'Basic support']
    }
];
```

## Testing

### Demo Component

Use the `CreditSystemDemo` component to test all features:

```jsx
import CreditSystemDemo from '@/components/CreditSystemDemo.jsx';

// Renders examples of all credit system components
<CreditSystemDemo />
```

## Future Enhancements

1. **Credit Gifting**: Allow users to gift credits to others
2. **Subscription Model**: Monthly credit packages
3. **Loyalty Program**: Bonus credits for regular users
4. **Credit Expiry Management**: Automatic renewals
5. **Multi-currency Support**: Support for different currencies
6. **Enterprise Billing**: Volume discounts for organizations

## Support

For implementation questions or customization needs, refer to:
- Component documentation in individual files
- Zustand store implementation
- Demo component examples
- API integration requirements

---

This credit system provides a flexible, user-friendly way to monetize educational services while maintaining transparency and providing excellent user experience.
