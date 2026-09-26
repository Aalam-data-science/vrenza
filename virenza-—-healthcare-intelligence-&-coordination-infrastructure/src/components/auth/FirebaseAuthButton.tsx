import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser, subscribeToAuth } from '../../services/firebase';
import { LogIn, LogOut, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const FirebaseAuthButton: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Firebase Auth sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      console.error('Firebase Auth sign-out failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#7A7568] bg-[#F4F2EE] rounded-lg border border-[#E7E4DC]">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="font-mono text-[11px]">Firebase Auth</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-[#E7E4DC] shadow-xs">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-5 h-5 rounded-full object-cover border border-[#C5D4C7]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#EAECE6] flex items-center justify-center text-[10px] font-bold text-[#2C5530]">
              {user.displayName?.[0] || 'U'}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-[11px] font-semibold text-[#22241F] leading-tight truncate max-w-[110px]">
              {user.displayName || 'Authenticated Member'}
            </div>
            <div className="text-[9px] font-mono text-[#3C7049] flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Firestore Synced</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign out of Firebase"
          className="p-1.5 text-[#7A7568] hover:text-[#B03A28] hover:bg-[#FDF2F0] rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignIn}
      disabled={isSigningIn}
      leftIcon={
        isSigningIn ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogIn className="w-3.5 h-3.5 text-[#2C5530]" />
        )
      }
      className="text-xs"
    >
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Sign In</span>
    </Button>
  );
};
