import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreditWidget from '@/components/CreditWidget.jsx';
import { useCreditStore } from '@/zustland/store.js';

// Mock the store for testing
jest.mock('@/zustland/store.js', () => ({
    useCreditStore: () => ({
        currentCredits: 1250,
        creditsExpiringSoon: 200,
        loading: false,
        addCredits: jest.fn()
    })
}));

describe('Credit Widget', () => {
    test('displays current credit balance', () => {
        render(<CreditWidget showBalance={true} />);
        expect(screen.getByText('1,250')).toBeInTheDocument();
    });

    test('shows expiring credits warning', () => {
        render(<CreditWidget />);
        expect(screen.getByText('200 expiring')).toBeInTheDocument();
    });

    test('renders compact mode correctly', () => {
        render(<CreditWidget compact={true} />);
        expect(screen.getByText('1,250')).toBeInTheDocument();
        expect(screen.getByText('Add Credits')).toBeInTheDocument();
    });
});

// Integration test example
describe('Credit System Integration', () => {
    test('credit transaction flow', () => {
        const { checkAndDeductCredits } = useCreditTransaction();
        
        // Test successful deduction
        const result = checkAndDeductCredits(100, 'Test Service', 'test');
        expect(result).toBe(true);
        
        // Test insufficient credits
        const result2 = checkAndDeductCredits(2000, 'Expensive Service', 'test');
        expect(result2).toBe(false);
    });
});
