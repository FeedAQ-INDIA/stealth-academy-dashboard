import React, { useState } from 'react';
import { BookOpen, Pencil, ExternalLink, Clock, Users, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

 

const Button = ({ children, size = 'default', variant = 'default', className = '', onClick, title, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow hover:shadow-md',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow'
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

const formatEventDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return `${formatDate(startDate)} • ${formatTime(startDate)} - ${formatTime(endDate)}`;
  }
  
  return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatDate(endDate)} ${formatTime(endDate)}`;
};

const formatEventTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getDuration = (start, end) => {
  const duration = (new Date(end) - new Date(start)) / (1000 * 60);
  if (duration < 60) return `${duration}m`;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const EnhancedEventCard = ({event}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showOverlaps, setShowOverlaps] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
   
  const handleEditSchedule = (event) => {
    console.log('Edit schedule:', event);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Learning Schedule</h1>
      
      <div
        className={`
          group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm 
          transition-all duration-300 ease-out hover:shadow-xl hover:border-gray-300
          ${event.overlappingCount > 0 ? 'ring-2 ring-amber-200/50' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient accent bar */}
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b transition-all duration-300 ${
          event.overlappingCount > 0 
            ? 'from-amber-400 to-orange-500' 
            : 'from-blue-500 to-purple-600'
        }`} />
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30" />
        
        <div className="relative p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
                  {event.title}
                </h3>
                
                {event.overlappingCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full border border-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-800">
                      {event.overlappingCount} conflict{event.overlappingCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Time and Duration */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{formatEventDateRange(event.scheduledStartDate, event.scheduledEndDate)}</span>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                  {getDuration(event.scheduledStartDate, event.scheduledEndDate)}
                </div>
              </div>
              
              {event.description && (
                <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsDetailsOpen(true);
                }}
                title="View Details"
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Details
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleEditSchedule(event)}
                title="Edit Schedule"
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </div>
            
            {event.scheduledLink && (
              <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => window.open(event.scheduledLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Join Session
              </Button>
            )}
          </div>
          
          {/* Overlapping Meetings Section */}
          {event.overlappingCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent"
                onClick={() => setShowOverlaps(!showOverlaps)}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Schedule Conflicts ({event.overlappingCount})
                  </span>
                </div>
                {showOverlaps ? (
                  <ChevronUp className="h-4 w-4 text-amber-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-amber-600" />
                )}
              </Button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showOverlaps ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-2">
                  {event.overlappingMeetings.map((overlap, index) => (
                    <div
                      key={overlap.id}
                      className={`
                        flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg
                        transform transition-all duration-200 delay-${index * 50}
                        ${showOverlaps ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {overlap.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)}
                        </div>
                      </div>
                      <div className="ml-3 px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded">
                        Conflict
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Hover Effect Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 
          transition-opacity duration-300 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />
      </div>
      
      {/* Mock additional cards for context */}
      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-l-xl" />
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900 mb-2">JavaScript Fundamentals</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span>Mon, Sep 16 • 2:00 PM - 4:00 PM</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">Learn the core concepts of JavaScript programming</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Details
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Join Session
              </Button>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm opacity-60">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gray-400 to-gray-500 rounded-l-xl" />
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900 mb-2">Database Design Principles</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span>Tue, Sep 17 • 9:00 AM - 11:00 AM</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">Understanding relational database design and normalization</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Details
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Join Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEventCard;