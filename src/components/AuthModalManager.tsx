import { AuthModal } from "./AuthModal";
import { useAuthModal } from "@/hooks/use-auth-modal";

export function AuthModalManager() {
  const { isOpen, mode, closeAuthModal } = useAuthModal();

  return (
    <AuthModal 
      isOpen={isOpen} 
      onClose={closeAuthModal} 
      initialMode={mode} 
    />
  );
}
