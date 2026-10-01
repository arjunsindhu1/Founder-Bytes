/**
 * Timezone and Date utilities for Founder Bytes
 * Enforces Asia/Kolkata (IST - Indian Standard Time, UTC+5:30)
 */

export function getCurrentISTDate(): {
  dayName: string;
  formattedDate: string;
  fullDateString: string;
  year: number;
} {
  const now = new Date();
  
  // Format options with Asia/Kolkata timezone
  const dayFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    timeZone: 'Asia/Kolkata',
  });

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const yearFormatter = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const dayName = dayFormatter.format(now);
  const formattedDate = dateFormatter.format(now);
  const year = parseInt(yearFormatter.format(now), 10);

  return {
    dayName,
    formattedDate,
    fullDateString: `${dayName}, ${formattedDate}`,
    year,
  };
}

export function formatISTDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const dateFormatter = new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    return `${dateFormatter.format(date)} at ${timeFormatter.format(date)} IST`;
  } catch {
    return isoString;
  }
}

export function formatISTTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    return `${timeFormatter.format(date)} IST`;
  } catch {
    return isoString;
  }
}

export function getRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(date);
  } catch {
    return '';
  }
}
