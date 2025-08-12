/**
 * Test file for CourseSidebar enhanced functionality
 * Tests automatic scrolling and visual feedback features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CourseProvider } from '../../contexts/CourseContext';
import CourseSidebar from './CourseSidebar';

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('../../hooks/use-toast', () => ({
  toast: mockToast
}));

// Mock course data
const mockCourseData = {
  courseList: [
    {
      id: 1,
      title: "Test Course",
      courseContent: [
        {
          courseContentId: 1,
          title: "Introduction Video",
          contentType: "VIDEO",
          courseVideoId: 101
        },
        {
          courseContentId: 2,
          title: "Course Material",
          contentType: "DOCUMENT", 
          courseDocId: 201
        },
        {
          courseContentId: 3,
          title: "Quiz 1",
          contentType: "QUIZ",
          courseQuizId: 301
        }
      ]
    }
  ],
  userCourseContentProgress: [],
  userCourseEnrollment: [{ courseId: 1, enrollmentStatus: "ACTIVE" }]
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <CourseProvider value={mockCourseData}>
      {children}
    </CourseProvider>
  </BrowserRouter>
);

describe('CourseSidebar Enhanced Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should scroll to active content when URL changes', async () => {
    // Mock window.location for URL simulation
    delete window.location;
    window.location = { pathname: '/course/1/video/101' };

    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  test('should show toast notification when scrolling to active content', async () => {
    window.location = { pathname: '/course/1/video/101' };

    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Navigated to active content",
        description: "Scrolled to Introduction Video",
        duration: 2000
      });
    });
  });

  test('should highlight active content with enhanced styling', () => {
    window.location = { pathname: '/course/1/video/101' };

    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    const activeItem = screen.getByText('Introduction Video').closest('[data-active="true"]');
    expect(activeItem).toHaveClass('bg-gradient-to-r', 'from-blue-100', 'to-indigo-100');
    expect(activeItem).toHaveClass('border-l-4', 'border-blue-500');
  });

  test('should trigger manual scroll with Ctrl+G keyboard shortcut', () => {
    window.location = { pathname: '/course/1/quiz/301' };

    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    fireEvent.keyDown(document, { key: 'g', ctrlKey: true });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Manual scroll triggered",
      description: "Scrolled to Quiz 1",
      duration: 2000
    });
  });

  test('should show scroll indicator in header', () => {
    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    const scrollButton = screen.getByTitle('Scroll to active content (Ctrl+G)');
    expect(scrollButton).toBeInTheDocument();
  });

  test('should apply custom scrollbar styles', () => {
    render(
      <TestWrapper>
        <CourseSidebar />
      </TestWrapper>
    );

    // Check if custom styles were injected
    const styleElement = document.getElementById('course-sidebar-custom-styles');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement.textContent).toContain('sidebar-scroll-container::-webkit-scrollbar');
  });

  test('should show progress indicators for completed content', () => {
    const mockDataWithProgress = {
      ...mockCourseData,
      userCourseContentProgress: [
        {
          courseId: 1,
          courseContentId: 1,
          progressStatus: "COMPLETED"
        }
      ]
    };

    render(
      <BrowserRouter>
        <CourseProvider value={mockDataWithProgress}>
          <CourseSidebar />
        </CourseProvider>
      </BrowserRouter>
    );

    const completedIcon = screen.getByRole('img', { hidden: true }); // Check mark icon
    expect(completedIcon).toBeInTheDocument();
  });

  test('should handle locked content properly', () => {
    const mockDataWithLocked = {
      ...mockCourseData,
      courseList: [{
        ...mockCourseData.courseList[0],
        courseContent: [
          {
            courseContentId: 4,
            title: "Locked Content",
            contentType: "VIDEO",
            isLocked: true
          }
        ]
      }]
    };

    render(
      <BrowserRouter>
        <CourseProvider value={mockDataWithLocked}>
          <CourseSidebar />
        </CourseProvider>
      </BrowserRouter>
    );

    const lockedItem = screen.getByText('Locked Content').closest('button');
    expect(lockedItem).toHaveClass('opacity-60', 'cursor-not-allowed');
  });
});

// Integration test for real navigation scenarios
describe('CourseSidebar Navigation Integration', () => {
  test('should update active state when navigating between content types', async () => {
    // Test video -> document -> quiz navigation
    const navigationTests = [
      { path: '/course/1/video/101', expectedTitle: 'Introduction Video' },
      { path: '/course/1/document/201', expectedTitle: 'Course Material' },
      { path: '/course/1/quiz/301', expectedTitle: 'Quiz 1' }
    ];

    for (const test of navigationTests) {
      window.location = { pathname: test.path };
      
      render(
        <TestWrapper>
          <CourseSidebar />
        </TestWrapper>
      );

      await waitFor(() => {
        const activeItem = screen.getByText(test.expectedTitle);
        expect(activeItem).toBeInTheDocument();
      });
    }
  });
});
