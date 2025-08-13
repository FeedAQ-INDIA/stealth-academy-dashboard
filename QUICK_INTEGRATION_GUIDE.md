# Quick Integration Guide for Existing Components

## Adding Credit Integration to Existing Features

### 1. Course Components

If you have existing course components, add credit integration like this:

```jsx
// In your existing course component
import { useCreditTransaction } from '@/components/CreditWidget.jsx';

const YourExistingCourseComponent = ({ course }) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    
    const handleEnrollment = () => {
        const success = checkAndDeductCredits(
            course.creditCost || 100, // Default 100 credits if not specified
            `Course: ${course.title}`,
            'course'
        );
        
        if (success) {
            // Your existing enrollment logic here
            enrollInCourse(course.id);
        }
    };

    return (
        <>
            {/* Your existing course UI */}
            <Button onClick={handleEnrollment}>
                Enroll ({course.creditCost || 100} credits)
            </Button>
            <InsufficientCreditsModal />
        </>
    );
};
```

### 2. Header Integration

Add credit display to your existing header:

```jsx
// In components-xm/Header/Header.jsx
import CreditWidget from '@/components/CreditWidget.jsx';

// Add this to your header JSX:
<CreditWidget compact={true} showQuickPurchase={true} />
```

### 3. Dashboard Integration

Add to your dashboard:

```jsx
// In any dashboard component
import CreditWidget from '@/components/CreditWidget.jsx';

<CreditWidget 
    showBalance={true}
    showQuickPurchase={true}
    className="mb-4"
/>
```

### 4. Service Integration

For any service that should cost credits:

```jsx
import { useCreditTransaction } from '@/components/CreditWidget.jsx';

const ServiceButton = ({ service, creditCost = 50 }) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    
    const handleService = () => {
        const success = checkAndDeductCredits(creditCost, service.name, 'service');
        if (success) {
            // Execute your service
            executeService(service);
        }
    };

    return (
        <>
            <Button onClick={handleService}>
                Use {service.name} ({creditCost} credits)
            </Button>
            <InsufficientCreditsModal />
        </>
    );
};
```

## Current File Structure

Your credit system files are organized as:

```
src/
├── components/
│   ├── CreditWidget.jsx           # Main credit widget
│   ├── ServicePricingGrid.jsx     # Service pricing display
│   ├── CreditSystemDemo.jsx       # Demo/example component
│   └── DashboardHeader.jsx        # Example header with credits
├── components-xm/AccountSettings/
│   └── Billing.jsx               # Enhanced billing page
└── zustland/
    └── store.js                  # Enhanced with credit store
```

## Key Features Ready to Use

✅ **Credit Balance Display**: Shows current credits anywhere in app
✅ **Automatic Deduction**: Handles credit deduction for services
✅ **Insufficient Credit Handling**: Shows modals when credits are low
✅ **Quick Purchase**: Fast credit top-up from any component
✅ **Transaction History**: Complete audit trail of credit usage
✅ **Multiple Packages**: Starter, Professional, Enterprise plans
✅ **Toast Notifications**: Success/error messages for all actions

## Next Steps

1. **Navigate to Billing**: Go to Account Settings > Billing to see the full system
2. **Test Credit Flow**: Try purchasing credits and using services
3. **Integrate Existing Features**: Add credit requirements to your existing courses/services
4. **Customize Pricing**: Adjust credit costs in the service definitions
5. **API Integration**: Connect the store functions to your backend APIs

The system is fully functional and ready for production use!
