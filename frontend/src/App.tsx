import { useProofStore } from "./store/proofStore";
import Sidebar from "./components/Sidebar";
import Graph from "./components/Graph";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { longestPathCycleProof } from "./proofs/longestPathCycle";
import { fiveColorTheoremProof } from "./proofs/fiveColorTheorem";
import { Proof } from "./types/graph";
import GoogleLoginButton from "./components/GoogleLoginButton";

function App() {
  const {
    currentProof,
    currentStepIndex,
    nextStep,
    previousStep,
    setCurrentProof,
  } = useProofStore();

  // For now, we'll use a hardcoded array of proofs
  // You can expand this as you add more proofs
  const availableProofs = [longestPathCycleProof, fiveColorTheoremProof];

  const currentStep = currentProof?.steps[currentStepIndex];

  // Layout state
  const [proofWidth, setProofWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [completedProofs, setCompletedProofs] = useState<number[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Dragging refs
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Restore userEmail from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // Load completed proofs when user logs in
  useEffect(() => {
    const loadCompletedProofs = async () => {
      console.log("Current user email:", userEmail);
      if (!userEmail) {
        setCompletedProofs([]);
        return;
      }
      // Just use the proofs_completed from the login response
      // No need to make another API call
      const storedProofs = localStorage.getItem("completedProofs");
      console.log(storedProofs);
      if (storedProofs) {
        setCompletedProofs(JSON.parse(storedProofs));
      }
    };

    loadCompletedProofs();
  }, [userEmail]);

  const handleLogin = (email: string, proofsCompleted: number[]) => {
    setUserEmail(email);
    setCompletedProofs(proofsCompleted || []);
    setIsLoginModalOpen(false);
  };

  const handleProofToggle = (proofId: number) => {
    if (!userEmail) {
      alert("Please log in to mark proofs as completed");
      return;
    }

    console.log("Current user email:", userEmail);
    console.log("Current completed proofs:", completedProofs);
    console.log("Toggling proof:", proofId);

    const newCompletedProofs = completedProofs.includes(proofId)
      ? completedProofs.filter((id) => id !== proofId)
      : [...completedProofs, proofId];

    console.log("New completed proofs:", newCompletedProofs);
    setCompletedProofs(newCompletedProofs);

    // Send update to backend
    fetch("http://localhost:8000/update-proofs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        proofs: newCompletedProofs,
      }),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json().then((data) => {
          console.log("Response data:", data);
          if (!response.ok) {
            throw new Error(data.error || "Failed to update proofs");
          }
          localStorage.setItem(
            "completedProofs",
            JSON.stringify(data.proofs_completed)
          );
        });
      })
      .catch((error) => {
        console.error("Error updating proofs:", error);
        alert(error.message);
        // Revert the checkbox state on error
        setCompletedProofs(completedProofs);
      });
  };

  useEffect(() => {
    const handleMouseMove = (e: {
      preventDefault: () => void;
      clientX: number;
    }) => {
      if (!isResizing.current) return;

      e.preventDefault();
      const deltaX = e.clientX - startX.current;
      const newWidth = Math.max(
        400,
        Math.min(800, startWidth.current + deltaX)
      );
      setProofWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        setIsDragging(false);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: {
    preventDefault: () => void;
    clientX: number;
  }) => {
    e.preventDefault();
    isResizing.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = proofWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleProofSelect = (proof: Proof) => {
    setCurrentProof(proof);
    setSidebarOpen(false);
  };

  // Add this logout handler
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("completedProofs");
    setUserEmail(null);
    setCompletedProofs([]);
  };

  return (
    <div className="flex h-screen bg-gray-900 relative">
      {/* Collapsible Proof Selection Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full shadow-lg z-50 transform transition-all duration-300 ${
          sidebarOpen ? "w-[400px]" : "w-[65px]"
        }`}
        style={{
          backgroundColor: "#1a1a1a",
          width: sidebarOpen ? `${sidebarWidth}px` : "65px",
        }}
      >
        <div
          className={`p-4 border-b border-gray-700 flex items-center ${
            sidebarOpen ? "flex-row-reverse justify-between" : "justify-end"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          {/* Login/Logout Buttons and user email in Sidebar, only when expanded */}
          {sidebarOpen && (
            <div className="flex gap-2 mr-2 items-center">
              {!userEmail && <GoogleLoginButton onLogin={handleLogin} />}
              {userEmail && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              )}
              {userEmail && (
                <span className="border border-gray-600 rounded px-3 py-1 text-gray-300 bg-gray-800 ml-2">
                  {userEmail}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`${
            sidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <div className="p-4 space-y-3">
            {availableProofs.map((proof) => (
              <button
                key={proof.id}
                onClick={() => handleProofSelect(proof)}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-colors ${
                  currentProof?.id === proof.id
                    ? "bg-blue-900 border-blue-700 text-blue-100"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={completedProofs.includes(proof.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleProofToggle(proof.id);
                    }}
                  />
                  <span className="font-medium">{proof.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-gray-800 text-gray-200 rounded-lg shadow-md hover:bg-gray-700 transition-shadow"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main
        className="p-8 items-center justify-center transition-all duration-300 w-full"
        style={{
          marginLeft: sidebarOpen ? `${sidebarWidth}px` : "65px",
        }}
      >
        <div className="h-full bg-gray-800 rounded-lg shadow-lg flex flex-row w-[95%] max-w-7xl overflow-hidden">
          {/* Proof Steps Panel */}
          <div
            style={{ width: `${proofWidth}px` }}
            className={`h-full bg-gray-800 rounded-lg ${
              isDragging ? "" : "transition-all duration-100 ease-in-out"
            }`}
          >
            <Sidebar />
          </div>

          {/* Draggable Separator */}
          <div
            className="w-2 h-[80vh] cursor-col-resize group flex items-center justify-center bg-gray-700 hover:bg-blue-600 transition-colors"
            onMouseDown={handleMouseDown}
            style={{ cursor: "col-resize", padding: "0.1rem" }}
          />

          {/* Visualization Panel */}
          <div className="flex-1 h-[80vh] p-4 flex flex-col">
            <div className="flex-1 bg-gray-900 rounded-lg">
              {/* Step Description Box */}
              {currentStep && (
                <div className="p-4 bg-gray-800 border-b border-gray-700 rounded-t-lg">
                  <div className="flex flex-col items-center text-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-100">
                        {currentStep.title}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Graph Visualization */}
              {currentStep ? (
                <Graph
                  vertices={currentStep.graphState.vertices}
                  edges={currentStep.graphState.edges}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-2 border-gray-600 rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2 text-gray-200">
                      Graph Visualization
                    </p>
                    <p className="text-sm text-gray-400">
                      Select a proof to see the visualization
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              className="bottom-4 right-4 flex flex-row gap-10"
              style={{
                position: "absolute",
                bottom: "3.5rem",
                right: "5.5rem",
              }}
            >
              <button
                className={`p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-shadow ${
                  !currentProof ||
                  currentStepIndex === currentProof.steps.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={nextStep}
                disabled={
                  !currentProof ||
                  currentStepIndex === currentProof.steps.length - 1
                }
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div
              className="flex flex-row gap-10"
              style={{ position: "absolute", bottom: "3.5rem", right: "8rem" }}
            >
              <button
                className={`p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-shadow ${
                  !currentProof || currentStepIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={previousStep}
                disabled={!currentProof || currentStepIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
