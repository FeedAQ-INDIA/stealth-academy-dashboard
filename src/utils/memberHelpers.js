import { Crown, Shield, User, Clock, UserX, UserCheck } from "lucide-react";

/**
 * Member status constants
 */
export const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
};

/**
 * Get member role display information with icon and styling
 * @param {Object} member - The member object
 * @param {string} courseOwnerId - The course owner's user ID
 * @returns {Object} Role display configuration
 */
export const getMemberRoleDisplay = (member, courseOwnerId) => {
  if (member.user?.userId === courseOwnerId) {
    return {
      role: "Owner",
      icon: Crown,
      color: "text-yellow-600 bg-yellow-100 border-yellow-200",
      priority: 3,
    };
  }
  if (member.accessLevel === "ADMIN") {
    return {
      role: "Admin",
      icon: Shield,
      color: "text-purple-600 bg-purple-100 border-purple-200",
      priority: 2,
    };
  }
  return {
    role: "Member",
    icon: User,
    color: "text-gray-600 bg-gray-100 border-gray-200",
    priority: 1,
  };
};

/**
 * Get member status display information
 * @param {Object} member - The member object
 * @returns {Object} Status display configuration
 */
export const getMemberStatusDisplay = (member) => {
  const baseClasses =
    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";

  if (member.status === MEMBER_STATUS.PENDING) {
    return {
      label: "Pending",
      icon: Clock,
      className: `${baseClasses} text-orange-600 bg-orange-100 border border-orange-200`,
    };
  }

  if (member.status === MEMBER_STATUS.INACTIVE) {
    return {
      label: "Inactive",
      icon: UserX,
      className: `${baseClasses} text-red-600 bg-red-100 border border-red-200`,
    };
  }

  if (member.isOnline) {
    return {
      label: "Online",
      icon: UserCheck,
      className: `${baseClasses} text-green-600 bg-green-100 border border-green-200`,
    };
  }

  return {
    label: "Offline",
    icon: UserX,
    className: `${baseClasses} text-gray-600 bg-gray-100 border border-gray-200`,
  };
};

/**
 * Format join date with relative time
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatJoinDate = (dateString) => {
  if (!dateString) return "Recently joined";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format last active time with relative display
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted last active string
 */
export const formatLastActive = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Get email count from semicolon-separated string
 * @param {string} emailString - Semicolon-separated email addresses
 * @returns {number} Count of valid email addresses
 */
export const getEmailCount = (emailString) => {
  if (!emailString) return 0;
  return emailString
    .split(";")
    .map((email) => email.trim())
    .filter((email) => email && email.includes("@")).length;
};

/**
 * Parse email addresses from semicolon-separated string
 * @param {string} emailString - Semicolon-separated email addresses
 * @returns {Array<string>} Array of valid email addresses
 */
export const parseEmailAddresses = (emailString) => {
  if (!emailString) return [];
  return emailString
    .split(";")
    .map((email) => email.trim())
    .filter((email) => email && email.includes("@"));
};
