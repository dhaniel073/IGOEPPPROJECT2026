import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Pressable } from 'react-native';

type InactivityContextType = {
  resetTimer: () => void;
};

export const InactivityContext = createContext<InactivityContextType | null>(null);

type Props = {
  children: ReactNode;
  timeout?: number; // optional, default in ms
};

export default function InactivityProvider({ children, timeout = 1 * 60 * 1000 }: Props) {
  const navigation = useNavigation<any>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBackgroundTimeRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const goToLockScreen = () => {
    router.replace('/(protected)/inactivescreen'); // or your inactivity screen
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(goToLockScreen, timeout);
  };

  // Start timer and listen for AppState changes
  useEffect(() => {
    resetTimer();

    const sub = AppState.addEventListener('change', nextState => {
      const prevState = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === 'background' || nextState === 'inactive') {
        // App is going out of foreground
        lastBackgroundTimeRef.current = Date.now();
        clearTimer(); // don’t keep running the inactivity timer while in bg
      }

      if (nextState === 'active') {
        // App is coming back to foreground
        const lastBg = lastBackgroundTimeRef.current;
        if (lastBg) {
          const diff = Date.now() - lastBg;
          if (diff >= timeout) {
            goToLockScreen();
            return;
          }
        }
        // User was away for less than timeout, resume normal inactivity timer
        resetTimer();
      }
    });

    return () => {
      clearTimer();
      sub.remove();
    };
  }, [timeout]);

  return (
    <Pressable style={{ flex: 1 }} onPress={resetTimer}>
      <InactivityContext.Provider value={{ resetTimer }}>
        {children}
      </InactivityContext.Provider>
    </Pressable>
  );
}
