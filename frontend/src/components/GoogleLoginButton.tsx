import { useState } from "react";
import LoginModal from "./LoginModal";

interface GoogleLoginButtonProps {
  onLogin: (email: string, proofsCompleted: number[]) => void;
}

export default function GoogleLoginButton({ onLogin }: GoogleLoginButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginSuccess = (email: string, proofsCompleted: number[]) => {
    onLogin(email, proofsCompleted);
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Login / Sign Up
      </button>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
