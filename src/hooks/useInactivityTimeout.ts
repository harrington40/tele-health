import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseInactivityTimeoutOptions {
  timeout?: number; // in milliseconds, default 6 minutes
  promptBefore?: number; // prompt user before logout, in milliseconds
  onPrompt?: () => void;
  onTimeout?: () => void;
}

export const useInactivityTimeout = (options: UseInactivityTimeoutOptions = {}) => {
  const {
    timeout = 6 * 60 * 1000, // 6 minutes (reduced from 15 minutes)
    promptBefore = 1 * 60 * 1000, // 1 minute before timeout (reduced from 2 minutes)
    onPrompt,
    onTimeout
  } = options;

  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const promptTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());
  const isPromptedRef = useRef<boolean>(false);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }

    // Reset prompt state
    isPromptedRef.current = false;

    // Only set timers if user is authenticated
    if (!isAuthenticated) return;

    // Set prompt timer
    promptTimeoutRef.current = setTimeout(() => {
      if (!isPromptedRef.current) {
        isPromptedRef.current = true;
        onPrompt?.();
      }
    }, timeout - promptBefore);

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      console.log('Auto-logout due to inactivity');
      onTimeout?.();
      await logout();
    }, timeout);

    lastActivityRef.current = Date.now();
  }, [timeout, promptBefore, onPrompt, onTimeout, logout, isAuthenticated]);

  const extendSession = useCallback(() => {
    if (isPromptedRef.current) {
      console.log('Session extended by user activity');
      isPromptedRef.current = false;
    }
    resetTimer();
  }, [resetTimer]);

  const logoutNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }
    await logout();
  }, [logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timers when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      return;
    }

    // Activity event types to monitor
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ];

    // Throttled activity handler to prevent excessive calls
    let throttleTimer: NodeJS.Timeout;
    const handleActivity = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        extendSession();
        throttleTimer = undefined as any;
      }, 1000); // Throttle to once per second
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer
    resetTimer();

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [isAuthenticated, resetTimer, extendSession]);

  // Reset timer when authentication state changes
  useEffect(() => {
    resetTimer();
  }, [isAuthenticated, resetTimer]);

  return {
    extendSession,
    logoutNow,
    isPrompted: isPromptedRef.current,
    timeUntilTimeout: () => {
      if (!timeoutRef.current) return 0;
      return Math.max(0, timeout - (Date.now() - lastActivityRef.current));
    },
    timeUntilPrompt: () => {
      if (!promptTimeoutRef.current) return 0;
      return Math.max(0, (timeout - promptBefore) - (Date.now() - lastActivityRef.current));
    }
  };
};